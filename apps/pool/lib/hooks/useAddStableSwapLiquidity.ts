import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { ZERO } from '@zenlink-interface/math'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@zenlink-interface/wagmi'
import { calculateStableSwapTokenAmount } from 'lib/functions'
import { useMemo } from 'react'

export function useAddStableSwapLiquidity(
  swap: StableSwapWithBase | undefined,
  amounts: Amount<Token>[],
  useBase: boolean,
): CalculatedStbaleSwapLiquidity {
  const allAmounts = useMemo(
    () => {
      const baseAmounts = swap?.baseSwap && useBase
        ? swap.baseSwap.pooledTokens.map(
          token => amounts.find(amount => amount.currency.equals(token)) || Amount.fromRawAmount(token, ZERO),
        )
        : []

      const metaAmounts = swap?.baseSwap
        ? swap.pooledTokens.map(
          token => token.equals(swap.baseSwap!.liquidityToken) && useBase
            ? Amount.fromRawAmount(token, ZERO)
            : amounts.find(amount => amount.currency.equals(token)) || Amount.fromRawAmount(token, ZERO),
        )
        : swap?.pooledTokens.map(
          token => amounts.find(amount => amount.currency.equals(token)) || Amount.fromRawAmount(token, ZERO),
        ) ?? []

      return { baseAmounts, metaAmounts }
    },
    [amounts, swap?.baseSwap, swap?.pooledTokens, useBase],
  )

  return useMemo(
    () => {
      const { baseAmounts, metaAmounts } = allAmounts

      try {
        return {
          amount: swap
            ? calculateStableSwapTokenAmount(
              swap,
              useBase,
              metaAmounts,
              baseAmounts,
              true,
            )
            : undefined,
          baseAmounts,
          metaAmounts,
        }
      }
      catch {
        return {
          amount: undefined,
          baseAmounts: [],
          metaAmounts: [],
        }
      }
    },
    [allAmounts, swap, useBase],
  )
}
