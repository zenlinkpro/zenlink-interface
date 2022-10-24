import type { TokenListsContext } from '../context'
import type { TokenAddressMap } from '../types'
import { useActiveListNames } from './useActiveListNames'
import { useCombinedTokenMapFromNames } from './useCombinedTokenMapFromNames'

export function useCombinedActiveList(context: TokenListsContext): TokenAddressMap {
  const activeListUrls = useActiveListNames(context)

  const activeTokens = useCombinedTokenMapFromNames(context, activeListUrls)

  return activeTokens
}
