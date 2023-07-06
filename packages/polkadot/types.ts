import type { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types'
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types'
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces'
import type { ParaChain } from '@zenlink-interface/polkadot-config'

export interface InjectedAccountExt {
  address: string
  meta: {
    name: string
    source: string
    whenCreated: number
  }
}

export interface ChainData {
  injectedAccounts: InjectedAccountExt[]
  properties: ChainProperties
  systemChain: string
  systemChainType: ChainType
  systemName: string
  systemVersion: string
}

export interface ApiState {
  apiDefaultTx: SubmittableExtrinsicFunction
  apiDefaultTxSudo: SubmittableExtrinsicFunction
  chainSS58: number
  hasInjectedAccounts: boolean
  isApiReady: boolean
  isDevelopment: boolean
  isEthereum: boolean
  specName: string
  specVersion: string
  systemChain: string
  systemName: string
  systemVersion: string
}

export interface ApiContext {
  states: Record<number, ApiState | undefined>
  apis: Record<number, ApiPromise | undefined>
  apiError: string | null
  extensions?: InjectedExtension[]
  accounts?: InjectedAccountWithMeta[]
  chainsConfig: ParaChain[]
  isWaitingInjected: boolean
}

export type CallParam = any

export type CallParams = [] | CallParam[]

export interface CallOptions<T> {
  defaultValue?: T
  paramMap?: (params: any) => CallParams
  transform?: (value: any, api: ApiPromise) => T
  withParams?: boolean
  withParamsTransform?: boolean
  enabled?: boolean
}

export enum ConnectorSource {
  Polkadot = 'polkadot-js',
  Subwallet = 'subwallet-js',
  Talisman = 'talisman',
  MantaWallet = 'manta-wallet-js',
}

export interface Connector {
  source: ConnectorSource
  id: string
  name: string
  installUrl?: string
}
