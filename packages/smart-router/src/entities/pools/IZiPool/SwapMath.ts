import type { IZiState } from '.'
import { BigNumber } from '@ethersproject/bignumber'
import { getAmountX, getAmountY } from './AmountMath'
import { getLogSqrtPriceFloor, getSqrtPrice } from './LogPowMath'

export const two96 = BigNumber.from(2).pow(96)

export interface RangeRetStateX2Y {
  finished: boolean
  costX: BigNumber
  acquireY: BigNumber
  finalPt: number
  sqrtFinalPriceX96: BigNumber
  liquidityX: BigNumber
}

export interface RangeRetStateY2X {
  finished: boolean
  costY: BigNumber
  acquireX: BigNumber
  finalPt: number
  sqrtFinalPriceX96: BigNumber
  liquidityX: BigNumber
}

export function x2YAtPrice(
  amountX: BigNumber,
  sqrtPriceX96: BigNumber,
  currY: BigNumber,
): { costX: BigNumber, acquireY: BigNumber } {
  let l = sqrtPriceX96.mul(amountX).div(two96)
  let acquireY = l.mul(sqrtPriceX96).div(two96)
  if (acquireY.gt(currY))
    acquireY = currY
  l = acquireY.mul(two96).div(sqrtPriceX96)
  const costX = l.mul(two96).div(sqrtPriceX96)
  return { costX, acquireY }
}

export function y2XAtPrice(
  amountY: BigNumber,
  sqrtPriceX96: BigNumber,
  currX: BigNumber,
): { costY: BigNumber, acquireX: BigNumber } {
  let l = amountY.mul(two96).div(sqrtPriceX96)
  const acquireX = l.mul(two96).div(sqrtPriceX96).gt(currX)
    ? currX
    : l.mul(two96).div(sqrtPriceX96)
  l = acquireX.mul(sqrtPriceX96).div(two96)
  const costY = l.mul(sqrtPriceX96).div(two96)
  return { costY, acquireX }
}

export function x2YAtPriceLiquidity(
  amountX: BigNumber,
  sqrtPriceX96: BigNumber,
  liquidity: BigNumber,
  liquidityX: BigNumber,
): { costX: BigNumber, acquireY: BigNumber, newLiquidityX: BigNumber } {
  const liquidityY = liquidity.sub(liquidityX)
  const maxTransformLiquidityX = amountX.mul(sqrtPriceX96).div(two96)
  const transformLiquidityX = maxTransformLiquidityX.gt(liquidityY) ? liquidityY : maxTransformLiquidityX
  const costX = transformLiquidityX.mul(two96).div(sqrtPriceX96)
  const acquireY = transformLiquidityX.mul(sqrtPriceX96).div(two96)
  const newLiquidityX = liquidityX.add(transformLiquidityX)
  return { costX, acquireY, newLiquidityX }
}

export function y2XAtPriceLiquidity(
  amountY: BigNumber,
  sqrtPriceX96: BigNumber,
  liquidityX: BigNumber,
): { costY: BigNumber, acquireX: BigNumber, newLiquidityX: BigNumber } {
  const maxTransformLiquidityY = amountY.mul(two96).div(sqrtPriceX96)
  const transformLiquidityY = maxTransformLiquidityY.gt(liquidityX) ? liquidityX : maxTransformLiquidityY
  const costY = transformLiquidityY.mul(sqrtPriceX96).div(two96)
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

function x2YRangeComplete(rg: Range, amountX: BigNumber): RangeCompRetX2Y {
  const ret = {} as RangeCompRetX2Y
  const sqrtPricePrM1X96 = rg.sqrtPriceRX96.mul(two96).div(rg.sqrtRateX96)
  const sqrtPricePrMlX96 = getSqrtPrice(rg.rightPt - rg.leftPt)
  const maxX = rg.liquidity.mul(sqrtPricePrMlX96.sub(two96)).div(rg.sqrtPriceRX96.sub(sqrtPricePrM1X96))
  if (maxX.lte(amountX)) {
    ret.costX = maxX
    ret.acquireY = getAmountY(rg.liquidity, rg.sqrtPriceLX96, rg.sqrtPriceRX96, rg.sqrtRateX96)
    ret.completeLiquidity = true
  }
  else {
    const sqrtValueX96 = amountX
      .mul(rg.sqrtPriceRX96.sub(sqrtPricePrM1X96))
      .div(rg.liquidity)
      .add(two96)
    const logValue = getLogSqrtPriceFloor(sqrtValueX96)
    ret.locPt = rg.rightPt - logValue
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
      const sqrtPricePrMlocX96 = getSqrtPrice(rg.rightPt - ret.locPt)
      ret.costX = rg.liquidity.mul(sqrtPricePrMlocX96.sub(two96)).div(rg.sqrtPriceRX96.sub(sqrtPricePrM1X96))
      ret.costX = ret.costX.gt(amountX) ? amountX : ret.costX
      ret.locPt = ret.locPt - 1
      ret.sqrtLocX96 = getSqrtPrice(ret.locPt)
      const sqrtLocA1X96 = ret.sqrtLocX96.add(
        ret.sqrtLocX96.mul(rg.sqrtRateX96.sub(two96)).div(two96),
      )
      ret.acquireY = getAmountY(rg.liquidity, sqrtLocA1X96, rg.sqrtPriceRX96, rg.sqrtRateX96)
    }
  }

  return ret
}

function y2XRangeComplete(rg: Range, amountY: BigNumber): RangeCompRetY2X {
  const ret = {} as RangeCompRetY2X
  const maxY = getAmountY(rg.liquidity, rg.sqrtPriceLX96, rg.sqrtPriceRX96, rg.sqrtRateX96)
  if (maxY.lte(amountY)) {
    ret.costY = maxY
    ret.acquireX = getAmountX(rg.liquidity, rg.leftPt, rg.rightPt, rg.sqrtPriceRX96, rg.sqrtRateX96)
    ret.completeLiquidity = true
  }
  else {
    const sqrtLocX96 = amountY
      .mul(rg.sqrtRateX96.sub(two96))
      .div(rg.liquidity)
      .add(rg.sqrtPriceLX96)
    ret.locPt = getLogSqrtPriceFloor(sqrtLocX96)
    ret.locPt = Math.max(rg.leftPt, ret.locPt)
    ret.locPt = Math.min(rg.rightPt - 1, ret.locPt)
    ret.completeLiquidity = false
    ret.sqrtLocX96 = getSqrtPrice(ret.locPt)
    if (ret.locPt === rg.leftPt) {
      ret.costY = BigNumber.from(0)
      ret.acquireX = BigNumber.from(0)
      return ret
    }

    const costY256 = getAmountY(rg.liquidity, rg.sqrtPriceLX96, ret.sqrtLocX96, rg.sqrtRateX96)
    // ret.costY <= amountY <= uint128.max
    ret.costY = costY256.gt(amountY) ? amountY : costY256

    // costY <= amountY even if the costY is the upperbound of the result
    // because amountY is not a real and sqrtLocX96 <= sqrtLoc256X96
    ret.acquireX = getAmountX(rg.liquidity, rg.leftPt, ret.locPt, ret.sqrtLocX96, rg.sqrtRateX96)
  }

  return ret
}

export function x2YRange(
  currentState: IZiState,
  leftPt: number,
  sqrtRateX96: BigNumber,
  originAmountX: BigNumber,
): RangeRetStateX2Y {
  const retState = {} as RangeRetStateX2Y
  retState.costX = BigNumber.from(0)
  retState.acquireY = BigNumber.from(0)
  retState.finished = false
  const currentHasY = currentState.liquidityX.lt(currentState.liquidity)

  let amountX = originAmountX

  if (currentHasY && (!currentState.liquidityX.eq(0) || leftPt === currentState.currentPoint)) {
    const { costX, acquireY, newLiquidityX } = x2YAtPriceLiquidity(
      amountX, currentState.sqrtPriceX96, currentState.liquidity, currentState.liquidityX,
    )
    retState.costX = costX
    retState.acquireY = acquireY
    retState.liquidityX = newLiquidityX
    if (retState.liquidityX.lt(currentState.liquidity) || retState.costX.gt(amountX)) {
      // remaining x is not enough to down current price to price / 1.0001
      // but x may remain, so we cannot simply use (costX == amountX)
      retState.finished = true
      retState.finalPt = currentState.currentPoint
      retState.sqrtFinalPriceX96 = currentState.sqrtPriceX96
    }
    else {
      amountX = amountX.sub(retState.costX)
    }
  }
  else if (currentHasY) { // all y
    currentState.currentPoint = currentState.currentPoint + 1
    // sqrt(price) + sqrt(price) * (1.0001 - 1) == sqrt(price) * 1.0001
    currentState.sqrtPriceX96 = currentState.sqrtPriceX96.add(
      currentState.sqrtPriceX96
        .mul(sqrtRateX96.sub(two96))
        .div(two96),
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
      } as Range,
      amountX,
    )
    retState.costX = retState.costX.add(ret.costX)
    amountX = amountX.sub(ret.costX)
    retState.acquireY = retState.acquireY.add(ret.acquireY)

    if (ret.completeLiquidity) {
      retState.finished = amountX.eq(0)
      retState.finalPt = leftPt
      retState.sqrtFinalPriceX96 = sqrtPriceLX96
      retState.liquidityX = currentState.liquidity
    }
    else {
      const {
        costX: locCostX,
        acquireY: locAcquireY,
        newLiquidityX: retLiquidityX,
      } = x2YAtPriceLiquidity(amountX, ret.sqrtLocX96, currentState.liquidity, BigNumber.from(0))
      retState.liquidityX = retLiquidityX
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
    // liquidityX has been set
    retState.finalPt = currentState.currentPoint
    retState.sqrtFinalPriceX96 = currentState.sqrtPriceX96
  }

  return retState
}

export function y2XRange(
  currentState: IZiState,
  rightPt: number,
  sqrtRateX96: BigNumber,
  originAmountY: BigNumber,
): RangeRetStateY2X {
  const retState = {} as RangeRetStateY2X

  retState.costY = BigNumber.from(0)
  retState.acquireX = BigNumber.from(0)
  retState.finished = false
  let amountY = originAmountY
  // first, if current point is not all x, we can not move right directly
  const startHasY = currentState.liquidityX.lte(currentState.liquidity)
  if (startHasY) {
    const { costY, acquireX, newLiquidityX } = y2XAtPriceLiquidity(
      amountY,
      currentState.sqrtPriceX96,
      currentState.liquidityX,
    )
    retState.costY = costY
    retState.acquireX = acquireX
    retState.liquidityX = newLiquidityX
    if (retState.liquidityX.gt(0) || retState.costY.gte(amountY)) {
      // it means remaining y is not enough to rise current price to price*1.0001
      // but y may remain, so we cannot simply use (costY == amountY)
      retState.finished = true
      retState.finalPt = currentState.currentPoint
      retState.sqrtFinalPriceX96 = currentState.sqrtPriceX96
      return retState
    }
    else {
      // y not run out
      // not finsihed
      amountY = amountY.sub(retState.costY)
      currentState.currentPoint += 1
      if (currentState.currentPoint === rightPt) {
        retState.finalPt = currentState.currentPoint
        // get fixed sqrt price to reduce accumulated error
        retState.sqrtFinalPriceX96 = getSqrtPrice(rightPt)
        return retState
      }
      // sqrt(price) + sqrt(price) * (1.0001 - 1) == sqrt(price) * 1.0001
      currentState.sqrtPriceX96 = currentState.sqrtPriceX96.add(
        currentState.sqrtPriceX96
          .mul(sqrtRateX96.sub(two96))
          .div(two96),
      )
    }
  }

  const sqrtPriceRX96 = getSqrtPrice(rightPt)

  // (uint128 liquidCostY, uint256 liquidAcquireX, bool liquidComplete, int24 locPt, uint160 sqrtLocX96)
  const ret = y2XRangeComplete(
    {
      liquidity: currentState.liquidity,
      sqrtPriceLX96: currentState.sqrtPriceX96,
      leftPt: currentState.currentPoint,
      sqrtPriceRX96,
      rightPt,
      sqrtRateX96,
    },
    amountY,
  )

  retState.costY = retState.costY.add(ret.costY)
  amountY = amountY.sub(ret.costY)
  retState.acquireX = retState.acquireX.add(ret.acquireX)
  if (ret.completeLiquidity) {
    retState.finished = amountY.eq(0)
    retState.finalPt = rightPt
    retState.sqrtFinalPriceX96 = sqrtPriceRX96
  }
  else {
    // trade at locPt
    const {
      costY: locCostY,
      acquireX: locAcquireX,
      newLiquidityX,
    } = y2XAtPriceLiquidity(amountY, ret.sqrtLocX96, currentState.liquidity)
    retState.liquidityX = newLiquidityX
    retState.costY = retState.costY.add(locCostY)
    retState.acquireX = retState.acquireX.add(locAcquireX)
    retState.finished = true
    retState.sqrtFinalPriceX96 = ret.sqrtLocX96
    retState.finalPt = ret.locPt
  }

  return retState
}
