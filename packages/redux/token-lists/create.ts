import type { AnyAction, CaseReducerActions, Reducer, SliceCaseReducers } from '@reduxjs/toolkit'
import {
  useActiveListNames as _useActiveListNames,
  useAllLists as _useAllLists,
  useCombinedActiveList as _useCombinedActiveList,
  useFetchListCallback as _useFetchListCallback,
  useIsListActive as _useIsListActive,
  useTokens as _useTokensCallback,
} from './hooks'
import type { TokenListsState } from './types'
import type { UpdaterProps } from './updater'
import { createUpdater } from './updater'
import { createTokenListsSlice } from './slice'
import type { TokenListsContext } from './context'

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
      ? I
      : []

type ParamsWithoutContext<T extends (...args: any) => any> = RemoveFirstFromTuple<Parameters<T>>

export interface TokenListsOptions {
  reducerPath?: string
}

export interface TokenListHooks {
  useAllLists: (...args: ParamsWithoutContext<typeof _useAllLists>) => ReturnType<typeof _useAllLists>
  useActiveListNames: (...args: ParamsWithoutContext<typeof _useActiveListNames>) => ReturnType<typeof _useActiveListNames>
  useCombinedActiveList: (
    ...args: ParamsWithoutContext<typeof _useCombinedActiveList>
  ) => ReturnType<typeof _useCombinedActiveList>
  useIsListActive: (...args: ParamsWithoutContext<typeof _useIsListActive>) => ReturnType<typeof _useIsListActive>
  useFetchListCallback: (
    ...args: ParamsWithoutContext<typeof _useFetchListCallback>
  ) => ReturnType<typeof _useFetchListCallback>
  useTokens: (...args: ParamsWithoutContext<typeof _useTokensCallback>) => ReturnType<typeof _useTokensCallback>
}

// Inspired by RTK Query's createApi
export function createTokenLists(options?: TokenListsOptions): {
  reducerPath: string
  reducer: Reducer<TokenListsState, AnyAction>
  actions: CaseReducerActions<SliceCaseReducers<any>, string>
  hooks: TokenListHooks
  Updater: (props: Omit<UpdaterProps, 'context'>) => JSX.Element
} {
  const reducerPath = options?.reducerPath ?? 'token-lists'
  const slice = createTokenListsSlice(reducerPath)
  const { actions, reducer } = slice
  const context: TokenListsContext = { reducerPath, actions }

  const useAllLists = (...args: ParamsWithoutContext<typeof _useAllLists>) => _useAllLists(context, ...args)
  const useActiveListNames = (...args: ParamsWithoutContext<typeof _useActiveListNames>) =>
    _useActiveListNames(context, ...args)
  const useCombinedActiveList = (...args: ParamsWithoutContext<typeof _useCombinedActiveList>) =>
    _useCombinedActiveList(context, ...args)
  const useIsListActive = (...args: ParamsWithoutContext<typeof _useIsListActive>) => _useIsListActive(context, ...args)
  const useFetchListCallback = (...args: ParamsWithoutContext<typeof _useFetchListCallback>) =>
    _useFetchListCallback(context, ...args)
  const useTokens = (...args: ParamsWithoutContext<typeof _useTokensCallback>) => _useTokensCallback(context, ...args)

  const hooks: TokenListHooks = {
    useAllLists,
    useActiveListNames,
    useCombinedActiveList,
    useIsListActive,
    useFetchListCallback,
    useTokens,
  }

  const Updater = createUpdater(context)

  return {
    reducerPath,
    reducer,
    actions,
    hooks,
    Updater,
  }
}
