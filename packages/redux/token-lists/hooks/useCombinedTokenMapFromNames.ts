import { useMemo } from 'react'

import type { TokenListsContext } from '../context'
import { combineMaps } from '../functions'
import type { TokenAddressMap } from '../types'
import { sortByListPriority, tokensToChainTokenMap } from '../utils'
import { useAllLists } from './useAllLists'

export function useCombinedTokenMapFromNames(context: TokenListsContext, urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists(context)
  return useMemo(() => {
    if (!urls)
      return {}
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current)
            return allTokens
          try {
            return combineMaps(allTokens, tokensToChainTokenMap(current))
          }
          catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, {})
    )
  }, [lists, urls])
}
