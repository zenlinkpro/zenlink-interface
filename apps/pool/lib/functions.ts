import { Pair, StableSwap } from '@zenlink-interface/amm'
import { Amount, Token } from '@zenlink-interface/currency'
import type { PoolFarm } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { ZERO } from '@zenlink-interface/math'
import type { StableSwapWithBase } from '@zenlink-interface/wagmi'

export function isStandardPool(pool: Pair | StableSwap | null): pool is Pair {
  return pool instanceof Pair
}

export function isStablePool(pool: Pair | StableSwap | null): pool is StableSwap {
  return pool instanceof StableSwap
}

export function swapFeeOfPool(type: POOL_TYPE) {
  if (type === POOL_TYPE.SINGLE_TOKEN_POOL)
    return ''
  return type === POOL_TYPE.STANDARD_POOL ? '0.30%' : '0.05%'
}

export function calculateStableSwapTokenAmount(swap: StableSwapWithBase, useBase: boolean, metaAmounts: Amount<Token>[], baseAmounts: Amount<Token>[], isDeposit: boolean) {
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

export function incentiveRewardToToken(chainId: number, incentive: PoolFarm['incentives'][0]): Token {
  return new Token({
    chainId,
    address: incentive.rewardToken.id,
    name: incentive.rewardToken.name,
    decimals: Number(incentive.rewardToken.decimals),
    symbol: incentive.rewardToken.symbol,
  })
}

export function calculateRemoveStableLiquidity(
  swap: StableSwapWithBase,
  useBase: boolean,
  lpAmount: Amount<Token>,
): { metaAmounts: Amount<Token>[], baseAmounts: Amount<Token>[] } {
  if (swap.baseSwap && useBase) {
    const baseToken = swap.baseSwap.liquidityToken
    const baseTokenIndex = swap.getTokenIndex(baseToken)
    const metaAmounts = swap.calculateRemoveLiquidity(lpAmount)
    const baseLpAmount = metaAmounts[baseTokenIndex]

    metaAmounts[baseTokenIndex] = Amount.fromRawAmount(baseToken, ZERO)
    const baseAmounts = swap.baseSwap.calculateRemoveLiquidity(baseLpAmount)

    return { metaAmounts, baseAmounts }
  }

  return {
    metaAmounts: swap.calculateRemoveLiquidity(lpAmount),
    baseAmounts: [],
  }
}

export function calculateRemoveStableLiquidityOneToken(
  swap: StableSwapWithBase,
  useBase: boolean,
  tokenIndex: number,
  lpAmount: Amount<Token>,
): Amount<Token> {
  if (swap.baseSwap && useBase) {
    const baseToken = swap.baseSwap.liquidityToken
    const baseTokenIndex = swap.getTokenIndex(baseToken)
    const baseLpAmount = swap.calculateRemoveLiquidityOneToken(lpAmount, baseTokenIndex)[0]

    return swap.baseSwap.calculateRemoveLiquidityOneToken(baseLpAmount, tokenIndex)[0]
  }

  return swap.calculateRemoveLiquidityOneToken(lpAmount, tokenIndex)[0]
}
