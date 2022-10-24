import type {
  useActiveListNames as _useActiveListNames,
  useAllLists as _useAllLists,
  useCombinedActiveList as _useCombinedActiveList,
  useIsListActive as _useIsListActive,
  useTokens as _useTokensCallback,
} from './hooks'

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
  useActiveListUrls: (...args: ParamsWithoutContext<typeof _useActiveListNames>) => ReturnType<typeof _useActiveListNames>
  useCombinedActiveList: (
    ...args: ParamsWithoutContext<typeof _useCombinedActiveList>
  ) => ReturnType<typeof _useCombinedActiveList>
  useIsListActive: (...args: ParamsWithoutContext<typeof _useIsListActive>) => ReturnType<typeof _useIsListActive>
  useTokens: (...args: ParamsWithoutContext<typeof _useTokensCallback>) => ReturnType<typeof _useTokensCallback>
}
