import type { BigNumber } from '@ethersproject/bignumber'
import { getSqrtPrice } from './LogPowMath'
import { two96 } from './SwapMath'

export function getAmountY(
  liquidity: BigNumber,
  sqrtPriceLX96: BigNumber,
  sqrtPriceRX96: BigNumber,
  sqrtRateX96: BigNumber,
): BigNumber {
  const numerator = sqrtPriceRX96.sub(sqrtPriceLX96)
  const denominator = sqrtRateX96.sub(two96)
  return liquidity.mul(numerator).div(denominator)
}

export function getAmountX(
  liquidity: BigNumber,
  leftPt: number,
  rightPt: number,
  sqrtPriceRX96: BigNumber,
  sqrtRateX96: BigNumber,
): BigNumber {
  const sqrtPricePrPlX96 = getSqrtPrice(rightPt - leftPt)
  const sqrtPricePrM1X96 = sqrtPriceRX96.mul(two96).div(sqrtRateX96)
  const numerator = sqrtPricePrPlX96.sub(two96)
  const denominator = sqrtPriceRX96.sub(sqrtPricePrM1X96)
  return liquidity.mul(numerator).div(denominator)
}
