import { Pair, StableSwap } from '@zenlink-interface/amm'
import type { Amount, Token } from '@zenlink-interface/currency'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import type { StableSwapWithBase } from '@zenlink-interface/wagmi'

export const isStandardPool = (pool: Pair | StableSwap | null): pool is Pair => {
  return pool instanceof Pair
}

export const isStablePool = (pool: Pair | StableSwap | null): pool is StableSwap => {
  return pool instanceof StableSwap
}

export const swapFeeOfPool = (type: POOL_TYPE) => {
  return type === POOL_TYPE.STANDARD_POOL ? '0.30%' : '0.05%'
}

export const calculateStableSwapTokenAmount = (
  swap: StableSwapWithBase,
  useBase: boolean,
  metaAmounts: Amount<Token>[],
  baseAmounts: Amount<Token>[],
  isDeposit: boolean,
) => {
  if (swap.baseSwap && useBase) {
    const lpToken = swap.baseSwap.liquidityToken
    const baseTokenIndex = swap.getTokenIndex(lpToken)
    const baseTokens = swap.baseSwap.calculateTokenAmount(baseAmounts, isDeposit)

    const copiedMetaAmounts = [...metaAmounts]

    copiedMetaAmounts[baseTokenIndex] = copiedMetaAmounts[baseTokenIndex].add(baseTokens)

    return swap.calculateTokenAmount(copiedMetaAmounts, isDeposit)
  }

  return swap.calculateTokenAmount(metaAmounts, isDeposit)
}
