import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import type { KeyringStore } from '@polkadot/ui-keyring/types'
import { formatBalance, objectSpread } from '@polkadot/util'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults'
import { keyring } from '@polkadot/ui-keyring'
import type { InjectedExtension } from '@polkadot/extension-inject/types'
import registry from '../typeRegistry'
import type { ApiContext, ApiState, ChainData, InjectedAccountExt } from '../types'

export const DEFAULT_DECIMALS = registry.createType('u32', 12)
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix)
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9']

const DISALLOW_EXTENSIONS: string[] = []

let api: ApiPromise

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

function createLink(baseApiUrl: string): (path: string) => string {
  return (path: string, apiUrl?: string): string =>
    `${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(apiUrl || baseApiUrl)}#${path}`
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
  types: Record<string, Record<string, string>>,
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
  apiUrl: string,
  onError: (error: unknown) => void,
): Promise<Record<string, Record<string, string>>> {
  const types = {}
  try {
    const provider = new WsProvider(apiUrl)

    api = new ApiPromise({
      provider,
      registry,
      types,
      // TODO: import auto-generated typesBundle from @polkadot/apps ?
      // (Includes all chains with a large amount of data)
      typesBundle: {},
    })
  }
  catch (error) {
    onError(error)
  }

  return types
}

interface Props {
  children: React.ReactNode
  apiUrl: string
  store?: KeyringStore
}

const Context = createContext<ApiContext | undefined>(undefined)

export const PolkadotApiProvider = ({ apiUrl, children, store }: Props) => {
  const [isApiConnected, setIsApiConnected] = useState(false)
  const [state, setState] = useState<ApiState>({ hasInjectedAccounts: false, isApiReady: false } as ApiState)
  const [isApiInitialized, setIsApiInitialized] = useState(false)
  const [apiError, setApiError] = useState<null | string>(null)
  const [extensions, setExtensions] = useState<InjectedExtension[]>()

  const value = useMemo<ApiContext>(
    () => objectSpread(
      {},
      state,
      {
        api,
        apiError,
        apiUrl,
        createLink: createLink(apiUrl),
        extensions,
        isApiConnected,
        isApiInitialized,
        isWaitingInjected: !extensions,
      }),
    [apiError, extensions, isApiConnected, isApiInitialized, state, apiUrl],
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
    createApi(apiUrl, onError)
      .then((types): void => {
        api.on('connected', () => setIsApiConnected(true))
        api.on('disconnected', () => setIsApiConnected(false))
        api.on('error', onError)
        api.on('ready', (): void => {
          const injectedPromise = web3Enable('zenlink-interface')

          injectedPromise
            .then(setExtensions)
            .catch(console.error)

          loadOnReady(api, injectedPromise, store, types)
            .then(setState)
            .catch(onError)
        })

        setIsApiInitialized(true)
      })
      .catch(onError)
  }, [apiUrl, onError, store])

  if (!value.isApiInitialized)
    return null

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export const usePolkadotApi = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return context
}

