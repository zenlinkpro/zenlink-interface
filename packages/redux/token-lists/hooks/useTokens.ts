import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'

import type { TokenListsContext } from '../context'
import { useCombinedActiveList } from './useCombinedActiveList'
import { useTokensFromMap } from './useTokensFromMap'

export function useTokens(context: TokenListsContext, chainId: ParachainId | undefined): { [address: string]: Token } {
  return useTokensFromMap(chainId, useCombinedActiveList(context))
}
