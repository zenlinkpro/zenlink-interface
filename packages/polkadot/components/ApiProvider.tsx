import { ApiPromise, WsProvider } from '@polkadot/api'
import type { KeyringStore } from '@polkadot/ui-keyring/types'
import { formatBalance, objectSpread } from '@polkadot/util'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults'
import { keyring } from '@polkadot/ui-keyring'
import type { InjectedAccountWithMeta, InjectedExtension, Unsubcall } from '@polkadot/extension-inject/types'
import type { ParaChain } from '@zenlink-interface/polkadot-config'
import type { ApiOptions } from '@polkadot/api/types'
import type { RegistryTypes } from '@polkadot/types/types'
import registry from '../typeRegistry'
import type { ApiContext, ApiState, ChainData, InjectedAccountExt } from '../types'

export const DEFAULT_DECIMALS = registry.createType('u32', 12)
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix)
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9']

const DISALLOW_EXTENSIONS: string[] = []

function isKeyringLoaded() {
  try {
    return !!keyring.keyring
  }
  catch {
    return false
  }
}

async function getInjectedAccounts(injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise
    const { web3Accounts } = await import('@polkadot/extension-dapp')

    const accounts = await web3Accounts()

    return accounts.map(({ address, meta }, whenCreated): InjectedAccountExt => ({
      address,
      meta: objectSpread({}, meta, {
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated,
      }),
    }))
  }
  catch (error) {
    console.error('web3Accounts', error)

    return []
  }
}

async function retrieve(
  api: ApiPromise,
  injectedPromise: Promise<InjectedExtension[]>,
): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion, injectedAccounts] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(injectedPromise),
  ])

  return {
    injectedAccounts: injectedAccounts.filter(({ meta: { source } }) =>
      !DISALLOW_EXTENSIONS.includes(source),
    ),
    properties: registry.createType('ChainProperties', {
      ss58Format: api.registry.chainSS58,
      tokenDecimals: api.registry.chainDecimals,
      tokenSymbol: api.registry.chainTokens,
    }),
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  }
}

async function loadOnReady(
  api: ApiPromise,
  injectedPromise: Promise<InjectedExtension[]>,
  store: KeyringStore | undefined,
  types: RegistryTypes,
): Promise<ApiState> {
  registry.register(types)

  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(api, injectedPromise)

  const chainSS58 = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
  const ss58Format = chainSS58
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX])
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS])
  const isEthereum = false
  const isDevelopment = (systemChainType.isDevelopment || systemChainType.isLocal)

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }))

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals.map(b => b.toNumber()),
    unit: tokenSymbol[0].toString(),
  })

  // finally load the keyring
  isKeyringLoaded() || keyring.loadAll({
    genesisHash: api.genesisHash,
    genesisHashAdd: [],
    isDevelopment,
    ss58Format,
    store,
    type: isEthereum ? 'ethereum' : 'ed25519',
  }, injectedAccounts)

  const defaultSection = Object.keys(api.tx)[0]
  const defaultMethod = Object.keys(api.tx[defaultSection])[0]
  const apiDefaultTx = api.tx[defaultSection][defaultMethod]
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    chainSS58,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment: isEthereum ? false : isDevelopment,
    isEthereum,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion,
  }
}

async function createApi(
  endpoints: string[],
  apiOptions: ApiOptions = {},
  onError: (error: unknown) => void,
): Promise<{ api: ApiPromise | undefined ; types: RegistryTypes }> {
  const types = apiOptions.types || {}
  const rpc = apiOptions.rpc || {}

  try {
    const provider = new WsProvider(endpoints)
    const api = new ApiPromise({
      provider,
      rpc,
      types,
    })
    return { api, types }
  }
  catch (error) {
    onError(error)
  }

  return { api: undefined, types }
}

interface Props {
  children: React.ReactNode
  chains: ParaChain[]
  store?: KeyringStore
}

export const PolkadotApiContext = createContext<ApiContext | undefined>(undefined)

export const PolkadotApiProvider = ({ chains, children, store }: Props) => {
  const [apis, setApis] = useState<ApiContext['apis']>({})
  const [states, setStates] = useState<ApiContext['states']>(
    chains.reduce((states, chain) =>
      ({ ...states, [chain.id]: { hasInjectedAccounts: false, isApiReady: false } }), {}),
  )
  const [apiError, setApiError] = useState<null | string>(null)
  const [extensions, setExtensions] = useState<InjectedExtension[]>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>()

  const value = useMemo<ApiContext>(
    () => objectSpread(
      {},
      {
        states,
        apis,
        apiError,
        chainsConfig: chains,
        extensions,
        accounts,
        isWaitingInjected: !extensions,
      }),
    [states, apis, apiError, chains, extensions, accounts],
  )

  const onError = useCallback(
    (error: unknown) => {
      console.error(error)

      setApiError((error as Error).message)
    },
    [setApiError],
  )

  // initial initialization
  useEffect(() => {
    // window is not defined in ssr mode, but needed in @polkadot/extension-dapp
    // issue: https://github.com/polkadot-js/extension/issues/571
    import('@polkadot/extension-dapp').then(({ web3Enable }) => {
      const injectedPromise = web3Enable('Manta DEX')
      injectedPromise
        .then(setExtensions)
        .catch(console.error)

      chains.forEach((chain) => {
        createApi(chain.endpoints, chain.apiOptions, onError)
          .then(({ api, types }): void => {
            if (api) {
              api.isReady.then(() => {
                setApis(apis => ({ ...apis, [chain.id]: api }))
              })

              api.on('error', onError)
              api.on('ready', () => {
                loadOnReady(api, injectedPromise, store, types)
                  .then(state => setStates(prev => ({ ...prev, [chain.id]: state })))
                  .catch(onError)
              })
            }
          })
          .catch(onError)
      })
    })
  }, [chains, onError, store])

  useEffect(() => {
    let unsub: Unsubcall | null = null

    import('@polkadot/extension-dapp').then(({ web3AccountsSubscribe }) => {
      if (extensions?.length) {
        web3AccountsSubscribe(setAccounts, { accountType: ['sr25519'] })
          .then((unsubcall) => { unsub = unsubcall })
      }
    })

    return () => {
      unsub?.()
    }
  }, [extensions?.length])

  return (
    <PolkadotApiContext.Provider value={value}>
      {children}
    </PolkadotApiContext.Provider>
  )
}
