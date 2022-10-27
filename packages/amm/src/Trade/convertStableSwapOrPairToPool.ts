import type { Pool } from '../Pool'
import type { StableSwap } from '../StablePool'
import { StablePool } from '../StablePool'

export function convertStableSwapOrPairToPool(pairs: Pool[], swaps: StableSwap[]): Pool[] {
  const pools: Pool[] = [...pairs]

  for (const swap of swaps) {
    const relatedSwaps = swaps.filter(otherSwap => otherSwap.involvesToken(swap.liquidityToken))

    for (let i = 0; i < swap.pooledTokens.length; i++) {
      for (let j = i + 1; j < swap.pooledTokens.length; j++) {
        pools.push(
          new StablePool(swap, swap.pooledTokens[i], swap.pooledTokens[j]),
        )
      }

      if (!relatedSwaps.length)
        continue

      for (const relatedSwap of relatedSwaps) {
        for (const token of relatedSwap.pooledTokens) {
          if (token.equals(swap.liquidityToken))
            continue

          pools.push(
            new StablePool(swap, swap.pooledTokens[i], token, relatedSwap),
          )
        }
      }
    }
  }

  return pools
}
