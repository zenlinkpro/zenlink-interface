import type { TokenList, WrappedTokenInfo } from '@zenlink-interface/token-lists'

export type TokenMap = Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList } }>
export type ChainTokenMap = Readonly<{ [chainId: number]: TokenMap }>
export type TokenAddressMap = ChainTokenMap

export type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

export interface TokenListsState {
  byName: {
    [name: string]: {
      current: TokenList | null
      pendingUpdate: TokenList | null
      loadingTimestamp: string | null
      error: string | null
    }
  }
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  lastInitializedDefaultListOfLists?: string[]

  // currently active lists
  activeLists: string[] | undefined
}

export type TokenListState = TokenListsState['byName'][string]

export interface WithTokenListsState {
  [path: string]: TokenListsState
}

export interface PendingPayload {
  name: string
  timestamp: string
}

export interface FulfilledPayload {
  name: string
  timestamp: string
  tokenList: TokenList
}

export interface RejectedPayload {
  name: string
  errorMessage: string
  timestamp: string
}

export type AddPayload = string

export type RemovePayload = string

export type EnablePayload = string

export type DisablePayload = string

export type AcceptPayload = string
