import type { Token } from '@zenlink-interface/currency'
import type { StableSwapWithBase } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'

export function useTokensFromStableSwap(swap?: StableSwapWithBase, useBase = true): Token[] {
  return useMemo(
    () => swap
      ? (useBase && swap.baseSwap)
          ? [
              ...swap.pooledTokens.filter(token => !token.equals(swap.baseSwap!.liquidityToken)),
              ...swap.baseSwap.pooledTokens,
            ]
          : swap.pooledTokens
      : [],
    [swap, useBase],
  )
}
