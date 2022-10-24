import { useSelector } from 'react-redux'

import type { TokenListsContext } from '../context'
import type { WithTokenListsState } from '../types'

export function useActiveListNames(context: TokenListsContext): string[] | undefined {
  const { reducerPath } = context
  return useSelector((state: WithTokenListsState) => state[reducerPath].activeLists)
}
