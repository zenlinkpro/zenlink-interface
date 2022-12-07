import type { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types'
import type { InjectedExtension } from '@polkadot/extension-inject/types'
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces'

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

export interface ApiContext extends ApiState {
  api: ApiPromise
  apiError: string | null
  apiUrl?: string
  createLink: (path: string, apiUrl?: string) => string
  extensions?: InjectedExtension[]
  isApiConnected: boolean
  isApiInitialized: boolean
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
}
