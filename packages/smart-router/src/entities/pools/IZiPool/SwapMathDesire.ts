import type { IZiState } from '.'
import { BigNumber } from '@ethersproject/bignumber'
import { getAmountX, getAmountY } from './AmountMath'
import { getLogSqrtPriceFloor, getSqrtPrice } from './LogPowMath'
import { two96 } from './SwapMath'

export interface RangeRetStateX2YDesire {
  finished: boolean
  costX: BigNumber
  acquireY: BigNumber
  finalPt: number
  sqrtFinalPriceX96: BigNumber
  liquidityX: BigNumber
}

export interface RangeRetStateY2XDesire {
  finished: boolean
  costY: BigNumber
  acquireX: BigNumber
  finalPt: number
  sqrtFinalPriceX96: BigNumber
  liquidityX: BigNumber
}

export function x2YDesireAtPrice(
  desireY: BigNumber,
  sqrtPriceX96: BigNumber,
  currY: BigNumber,
): { costX: BigNumber, acquireY: BigNumber } {
  let acquireY = desireY
  if (acquireY.gt(currY))
    acquireY = currY
  const l = acquireY.mul(two96).div(sqrtPriceX96)
  const costX = l.mul(two96).div(sqrtPriceX96)
  return { costX, acquireY }
}

export function y2XDesireAtPrice(
  desireX: BigNumber,
  sqrtPriceX96: BigNumber,
  currX: BigNumber,
): { costY: BigNumber, acquireX: BigNumber } {
  const acquireX = desireX.gt(currX) ? currX : desireX
  const l = acquireX.mul(sqrtPriceX96).div(two96)
  const costY = l.mul(sqrtPriceX96).div(two96)
  return { costY, acquireX }
}

export function x2YAtPriceLiquidity(
  desireY: BigNumber,
  sqrtPriceX96: BigNumber,
  liquidity: BigNumber,
  liquidityX: BigNumber,
): { costX: BigNumber, acquireY: BigNumber, newLiquidityX: BigNumber } {
  const liquidityY = liquidity.sub(liquidityX)
  const maxTransformLiquidityX = desireY.mul(two96).div(sqrtPriceX96)
  // transformLiquidityX <= liquidityY <= uint128.max
  const transformLiquidityX = maxTransformLiquidityX.gt(liquidityY) ? liquidityY : maxTransformLiquidityX
  // transformLiquidityX * 2^96 <= 2^128 * 2^96 <= 2^224 < 2^256
  const costX = transformLiquidityX.mul(two96).div(sqrtPriceX96)
  // acquireY should not > uint128.max
  const acquireY256 = transformLiquidityX.mul(sqrtPriceX96).div(two96)
  const acquireY = acquireY256
  const newLiquidityX = liquidityX.add(transformLiquidityX)
  return { costX, acquireY, newLiquidityX }
}

export function y2XAtPriceLiquidity(
  desireX: BigNumber,
  sqrtPriceX96: BigNumber,
  liquidityX: BigNumber,
): { costY: BigNumber, acquireX: BigNumber, newLiquidityX: BigNumber } {
  const maxTransformLiquidityY = desireX.mul(sqrtPriceX96).div(two96)
  // transformLiquidityY <= liquidityX <= uint128.max
  const transformLiquidityY = maxTransformLiquidityY.gt(liquidityX) ? liquidityX : maxTransformLiquidityY
  const costY = transformLiquidityY.mul(sqrtPriceX96).div(two96)
  // transformLiquidityY * TwoPower.Pow96 < 2^128 * 2^96 = 2^224 < 2^256
  const acquireX = transformLiquidityY.mul(two96).div(sqrtPriceX96)
  const newLiquidityX = liquidityX.sub(transformLiquidityY)
  return { costY, acquireX, newLiquidityX }
}

interface Range {
  liquidity: BigNumber
  sqrtPriceLX96: BigNumber
  leftPt: number
  sqrtPriceRX96: BigNumber
  rightPt: number
  sqrtRateX96: BigNumber
}

interface RangeCompRetX2Y {
  costX: BigNumber
  acquireY: BigNumber
  completeLiquidity: boolean
  locPt: number
  sqrtLocX96: BigNumber
}

interface RangeCompRetY2X {
  costY: BigNumber
  acquireX: BigNumber
  completeLiquidity: boolean
  locPt: number
  sqrtLocX96: BigNumber
}

function x2YRangeComplete(rg: Range, desireY: BigNumber): RangeCompRetX2Y {
  const ret = {} as RangeCompRetX2Y

  const maxY = getAmountY(rg.liquidity, rg.sqrtPriceLX96, rg.sqrtPriceRX96, rg.sqrtRateX96)
  if (maxY.lte(desireY)) {
    ret.acquireY = maxY
    ret.costX = getAmountX(
      rg.liquidity, rg.leftPt, rg.rightPt, rg.sqrtPriceRX96, rg.sqrtRateX96,
    )
    ret.completeLiquidity = true
    return ret
  }
  const cl = rg.sqrtPriceRX96.sub(
    desireY.mul(rg.sqrtRateX96.sub(two96)).div(rg.liquidity),
  )
  ret.locPt = getLogSqrtPriceFloor(cl) + 1

  ret.locPt = Math.min(ret.locPt, rg.rightPt)
  ret.locPt = Math.max(ret.locPt, rg.leftPt + 1)
  ret.completeLiquidity = false

  if (ret.locPt === rg.rightPt) {
    ret.costX = BigNumber.from(0)
    ret.acquireY = BigNumber.from(0)
    ret.locPt = ret.locPt - 1
    ret.sqrtLocX96 = getSqrtPrice(ret.locPt)
  }
  else {
    // rg.rightPt - ret.locPt <= 256 * 100
    // sqrtPricePrMlocX96 <= 1.0001 ** 25600 * 2 ^ 96 = 13 * 2^96 < 2^100
    const sqrtPricePrMlocX96 = getSqrtPrice(rg.rightPt - ret.locPt)
    // rg.sqrtPriceRX96 * TwoPower.Pow96 < 2^160 * 2^96 = 2^256
    const sqrtPricePrM1X96 = rg.sqrtPriceRX96.mul(two96).div(rg.sqrtRateX96)
    // rg.liquidity * (sqrtPricePrMlocX96 - TwoPower.Pow96) < 2^128 * 2^100 = 2^228 < 2^256
    ret.costX = rg.liquidity.mul(sqrtPricePrMlocX96.sub(two96)).div(rg.sqrtPriceRX96.sub(sqrtPricePrM1X96))

    ret.locPt = ret.locPt - 1
    ret.sqrtLocX96 = getSqrtPrice(ret.locPt)

    const sqrtLocA1X96 = ret.sqrtLocX96.add(
      ret.sqrtLocX96.mul(rg.sqrtRateX96.sub(two96)).div(two96),
    )
    ret.acquireY = getAmountY(rg.liquidity, sqrtLocA1X96, rg.sqrtPriceRX96, rg.sqrtRateX96)
    // ret.acquireY <= desireY <= uint128.max
  }

  return ret
}

function y2XRangeComplete(rg: Range, desireX: BigNumber): RangeCompRetY2X {
  const ret = {} as RangeCompRetY2X
  const maxX = getAmountX(rg.liquidity, rg.leftPt, rg.rightPt, rg.sqrtPriceRX96, rg.sqrtRateX96)
  if (maxX.lte(desireX)) {
    // maxX <= desireX <= uint128.max
    ret.acquireX = maxX
    ret.costY = getAmountY(rg.liquidity, rg.sqrtPriceLX96, rg.sqrtPriceRX96, rg.sqrtRateX96)
    ret.completeLiquidity = true
    return ret
  }
  const sqrtPricePrPlX96 = getSqrtPrice(rg.rightPt - rg.leftPt)
  // rg.sqrtPriceRX96 * 2^96 < 2^160 * 2^96 = 2^256
  const sqrtPricePrM1X96 = rg.sqrtPriceRX96.mul(two96).div(rg.sqrtRateX96)

  // div must be > 2^96 because, if
  //  div <= 2^96
  //  <=>  sqrtPricePrPl_96 - desireX * (sqrtPriceR_96 - sqrtPricePrM1_96) / liquidity <= 2^96 (here, '/' is div of int)
  //  <=>  desireX >= (sqrtPricePrPl_96 - 2^96) * liquidity / (sqrtPriceR_96 - sqrtPricePrM1_96)
  //  <=>  desireX >= maxX
  //  will enter the branch above and return
  const div = sqrtPricePrPlX96.sub(
    desireX.mul(rg.sqrtPriceRX96.sub(sqrtPricePrM1X96)).div(rg.liquidity),
  )

  // 1. rg.sqrtPriceR_96 * 2^96 < 2^160 * 2^96 = 2^256
  // 2. sqrtPriceLoc_96 must < rg.sqrtPriceR_96, because div > 2^96
  const sqrtPriceLocX96 = rg.sqrtPriceRX96.mul(two96).div(div)

  ret.completeLiquidity = false
  ret.locPt = getLogSqrtPriceFloor(sqrtPriceLocX96)

  ret.locPt = Math.max(rg.leftPt, ret.locPt)
  ret.locPt = Math.min(rg.rightPt - 1, ret.locPt)
  ret.sqrtLocX96 = getSqrtPrice(ret.locPt)

  if (ret.locPt === rg.leftPt) {
    ret.acquireX = BigNumber.from(0)
    ret.costY = BigNumber.from(0)
    return ret
  }

  ret.completeLiquidity = false
  // ret.acquireX <= desireX <= uint128.max
  const amountX = getAmountX(
    rg.liquidity,
    rg.leftPt,
    ret.locPt,
    ret.sqrtLocX96,
    rg.sqrtRateX96,
  )
  ret.acquireX = amountX.gt(desireX) ? desireX : amountX

  ret.costY = getAmountY(
    rg.liquidity,
    rg.sqrtPriceLX96,
    ret.sqrtLocX96,
    rg.sqrtRateX96,
  )

  return ret
}

export function x2YDesireRange(
  currentState: IZiState,
  leftPt: number,
  sqrtRateX96: BigNumber,
  originDesireY: BigNumber,
): RangeRetStateX2YDesire {
  const retState = {} as RangeRetStateX2YDesire

  retState.costX = BigNumber.from(0)
  retState.acquireY = BigNumber.from(0)
  retState.finished = false

  let desireY = originDesireY

  const currentHasY = currentState.liquidityX.lt(currentState.liquidity)
  if (currentHasY && (currentState.liquidityX.gt(0) || leftPt === currentState.currentPoint)) {
    const { costX, acquireY, newLiquidityX } = x2YAtPriceLiquidity(
      desireY, currentState.sqrtPriceX96, currentState.liquidity, currentState.liquidityX,
    )
    retState.costX = costX
    retState.acquireY = acquireY
    retState.liquidityX = newLiquidityX
    if (retState.liquidityX.lt(currentState.liquidity) || retState.acquireY.gte(desireY)) {
      // remaining desire y is not enough to down current price to price / 1.0001
      // but desire y may remain, so we cannot simply use (retState.acquireY >= desireY)
      retState.finished = true
      retState.finalPt = currentState.currentPoint
      retState.sqrtFinalPriceX96 = currentState.sqrtPriceX96
    }
    else {
      desireY = desireY.sub(retState.acquireY)
    }
  }
  else if (currentHasY) { // all y
    currentState.currentPoint = currentState.currentPoint + 1
    // sqrt(price) + sqrt(price) * (1.0001 - 1) == sqrt(price) * 1.0001
    currentState.sqrtPriceX96 = currentState.sqrtPriceX96.add(
      currentState.sqrtPriceX96.mul(sqrtRateX96.sub(two96)).div(two96),
    )
  }
  else {
    retState.liquidityX = currentState.liquidityX
  }

  if (retState.finished)
    return retState

  if (leftPt < currentState.currentPoint) {
    const sqrtPriceLX96 = getSqrtPrice(leftPt)
    const ret = x2YRangeComplete(
      {
        liquidity: currentState.liquidity,
        sqrtPriceLX96,
        leftPt,
        sqrtPriceRX96: currentState.sqrtPriceX96,
        rightPt: currentState.currentPoint,
        sqrtRateX96,
      },
      desireY,
    )
    retState.costX = retState.costX.add(ret.costX)
    desireY = desireY.sub(ret.acquireY)
    retState.acquireY = retState.acquireY.add(ret.acquireY)

    if (ret.completeLiquidity) {
      retState.finished = desireY.eq(0)
      retState.finalPt = leftPt
      retState.sqrtFinalPriceX96 = sqrtPriceLX96
      retState.liquidityX = currentState.liquidity
    }
    else {
      // trade at locPt
      const { costX: locCostX, acquireY: locAcquireY, newLiquidityX } = x2YAtPriceLiquidity(
        desireY, ret.sqrtLocX96, currentState.liquidity, BigNumber.from(0),
      )
      retState.liquidityX = newLiquidityX

      retState.costX = retState.costX.add(locCostX)
      retState.acquireY = retState.acquireY.add(locAcquireY)
      retState.finished = true
      retState.sqrtFinalPriceX96 = ret.sqrtLocX96
      retState.finalPt = ret.locPt
    }
  }
  else {
    // finishd must be false
    // retState.finished == false;
    retState.finalPt = currentState.currentPoint
    retState.sqrtFinalPriceX96 = currentState.sqrtPriceX96
  }

  return retState
}

export function y2XDesireRange(
  currentState: IZiState,
  rightPt: number,
  sqrtRateX96: BigNumber,
  originDesireX: BigNumber,
): RangeRetStateY2XDesire {
  const retState = {} as RangeRetStateY2XDesire

  retState.costY = BigNumber.from(0)
  retState.acquireX = BigNumber.from(0)
  retState.finished = false
  let desireX = originDesireX
  // first, if current point is not all x, we can not move right directly
  const startHasY = currentState.liquidityX.lt(currentState.liquidity)

  if (startHasY) {
    const {
      costY,
      acquireX,
      newLiquidityX,
    } = y2XAtPriceLiquidity(desireX, currentState.sqrtPriceX96, currentState.liquidityX)
    retState.costY = costY
    retState.acquireX = acquireX
    retState.liquidityX = newLiquidityX

    if (!retState.liquidityX.eq(0) || retState.acquireX.gte(desireX)) {
      // currX remain, means desire runout
      retState.finished = true
      retState.finalPt = currentState.currentPoint
      retState.sqrtFinalPriceX96 = currentState.sqrtPriceX96
      return retState
    }
    else {
      // not finished
      desireX = desireX.sub(retState.acquireX)
      currentState.currentPoint += 1
      if (currentState.currentPoint === rightPt) {
        retState.finalPt = currentState.currentPoint
        // get fixed sqrt price to reduce accumulated error
        retState.sqrtFinalPriceX96 = getSqrtPrice(rightPt)
        return retState
      }
      // sqrt(price) + sqrt(price) * (1.0001 - 1) == sqrt(price) * 1.0001
      currentState.sqrtPriceX96 = currentState.sqrtPriceX96.add(
        currentState.sqrtPriceX96.mul(sqrtRateX96.sub(two96)).div(two96),
      )
    }
  }

  const sqrtPriceRX96 = getSqrtPrice(rightPt)
  const ret = y2XRangeComplete(
    {
      liquidity: currentState.liquidity,
      sqrtPriceLX96: currentState.sqrtPriceX96,
      leftPt: currentState.currentPoint,
      sqrtPriceRX96,
      rightPt,
      sqrtRateX96,
    },
    desireX,
  )
  retState.costY = retState.costY.add(ret.costY)
  retState.acquireX = retState.acquireX.add(ret.acquireX)
  desireX = desireX.sub(ret.acquireX)

  if (ret.completeLiquidity) {
    retState.finished = desireX.eq(0)
    retState.finalPt = rightPt
    retState.sqrtFinalPriceX96 = sqrtPriceRX96
  }
  else {
    const {
      costY: locCostY,
      acquireX: locAcquireX,
      newLiquidityX,
    } = y2XAtPriceLiquidity(desireX, ret.sqrtLocX96, currentState.liquidity)
    retState.liquidityX = newLiquidityX
    retState.costY = retState.costY.add(locCostY)
    retState.acquireX = retState.acquireX.add(locAcquireX)
    retState.finished = true
    retState.finalPt = ret.locPt
    retState.sqrtFinalPriceX96 = ret.sqrtLocX96
  }

  return retState
}
