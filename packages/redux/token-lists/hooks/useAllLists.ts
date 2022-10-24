import { useSelector } from 'react-redux'

import type { TokenListsContext } from '../context'
import type { WithTokenListsState } from '../types'

export function useAllLists(context: TokenListsContext) {
  const { reducerPath } = context
  return useSelector((state: WithTokenListsState) => {
    return state[reducerPath].byName
  })
}
