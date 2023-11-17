import { ApiPromise, WsProvider } from '@polkadot/api'
import type { KeyringStore } from '@polkadot/ui-keyring/types'
import { formatBalance, objectSpread } from '@polkadot/util'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults'
import { keyring } from '@polkadot/ui-keyring'
import type { ParaChain } from '@zenlink-interface/polkadot-config'
import type { ApiOptions } from '@polkadot/api/types'
import type { Account, BaseWallet } from '@polkadot-onboard/core'
import type { RegistryTypes } from '@polkadot/types/types'
import type { ApiContext, ApiState, ChainData } from '../types'
import { ConnectContainer } from './ConnectContainer'

export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9']

function isKeyringLoaded() {
  try {
    return !!keyring.keyring
  }
  catch {
    return false
  }
}

async function retrieve(api: ApiPromise): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(api.registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ])

  return {
    properties: api.registry.createType('ChainProperties', {
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
  store: KeyringStore | undefined,
  types: RegistryTypes,
): Promise<ApiState> {
  api.registry.register(types)
  const DEFAULT_DECIMALS = api.registry.createType('u32', 12)
  const DEFAULT_SS58 = api.registry.createType('u32', addressDefaults.prefix)

  const { properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(api)

  const chainSS58 = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
  const ss58Format = chainSS58
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX])
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS])
  const isEthereum = false
  const isDevelopment = (systemChainType.isDevelopment || systemChainType.isLocal)

  // explicitly override the ss58Format as specified
  api.registry.setChainProperties(
    api.registry.createType('ChainProperties', {
      ss58Format,
      tokenDecimals,
      tokenSymbol,
    }),
  )

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
  })

  const defaultSection = Object.keys(api.tx)[0]
  const defaultMethod = Object.keys(api.tx[defaultSection])[0]
  const apiDefaultTx = api.tx[defaultSection][defaultMethod]
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    chainSS58,
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
): Promise<{ api: ApiPromise | undefined, types: RegistryTypes }> {
  const types = (apiOptions.types || {}) as RegistryTypes
  const typesBundle = apiOptions.typesBundle || {}
  const rpc = apiOptions.rpc || {}

  try {
    const provider = new WsProvider(endpoints)

    const api = new ApiPromise({
      rpc,
      provider,
      types,
      typesBundle,
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

export function PolkadotApiProvider({ chains, children, store }: Props) {
  const [apis, setApis] = useState<ApiContext['apis']>({})
  const [states, setStates] = useState<ApiContext['states']>(
    chains.reduce((states, chain) =>
      ({ ...states, [chain.id]: { hasInjectedAccounts: false, isApiReady: false } }), {}),
  )
  const [apiError, setApiError] = useState<null | string>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [wallet, setWallet] = useState<BaseWallet>()

  const value = useMemo<ApiContext>(
    () => objectSpread(
      {},
      {
        states,
        apis,
        apiError,
        chainsConfig: chains,
        accounts,
        wallet,
        setAccounts,
        setWallet,
      }),
    [accounts, apiError, apis, chains, states, wallet],
  )

  // initial initialization
  useEffect(() => {
    const onError = (error: unknown): void => {
      console.error(error)

      setApiError((error as Error).message)
    }

    chains.forEach((chain) => {
      createApi(chain.endpoints, chain.apiOptions, onError)
        .then(({ api, types }): void => {
          if (api) {
            api.isReady.then(() => {
              setApis(apis => ({ ...apis, [chain.id]: api }))
            })

            api.on('error', onError)
            api.on('ready', () => {
              loadOnReady(api, store, types)
                .then(state => setStates(prev => ({ ...prev, [chain.id]: state })))
                .catch(onError)
            })
          }
        })
        .catch(onError)
    })
  }, [chains, store])

  return (
    <ConnectContainer>
      <PolkadotApiContext.Provider value={value}>
        {children}
      </PolkadotApiContext.Provider>
    </ConnectContainer>
  )
}
