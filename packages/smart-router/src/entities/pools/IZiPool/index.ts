import type { BaseToken } from '@zenlink-interface/amm'
import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'tiny-invariant'
import { BasePool } from '../BasePool'
import { getBigNumber, getNumber } from '../../../util'
import { FindLeftOperator, FindRightOperator, findLeft, findRight } from './BinarySearch'
import { two96, x2YAtPrice, x2YRange, y2XAtPrice, y2XRange } from './SwapMath'
import { getSqrtPrice } from './LogPowMath'
import {
  findLeftFromCursor,
  findRightFromCursor,
  nearestLeftOneOrBoundary,
  nearestRightOneOrBoundary,
} from './Orders'
import { x2YDesireAtPrice, x2YDesireRange, y2XDesireAtPrice, y2XDesireRange } from './SwapMathDesire'

export const IZI_LEFT_MOST_PT = -800000
export const IZI_RIGHT_MOST_PT = -IZI_LEFT_MOST_PT

export interface IZiState {
  sqrtPriceX96: BigNumber
  currentPoint: number
  liquidity: BigNumber
  liquidityX: BigNumber
}

export interface IZiOrders {
  liquidity: BigNumber[]
  liquidityDeltaPoint: number[]

  sellingX: BigNumber[]
  sellingXPoint: number[]

  sellingY: BigNumber[]
  sellingYPoint: number[]
}

export interface Cursor {
  liquidityIdx: number
  sellingIdx: number
  currentPoint: number
  isLiquidityPoint: boolean
  isLimitOrderPoint: boolean
}

export class IZiPool extends BasePool {
  public readonly state: IZiState
  public readonly pointDelta: number
  public readonly orders: IZiOrders

  public readonly rightMostPt: number
  public readonly leftMostPt: number
  public readonly sqrtRateX96: BigNumber

  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    state: IZiState,
    pointDelta: number,
    orders: IZiOrders,
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.state = state
    this.pointDelta = pointDelta
    this.orders = orders
    this.rightMostPt = Math.floor(IZI_RIGHT_MOST_PT / this.pointDelta) * this.pointDelta
    this.leftMostPt = -this.rightMostPt
    this.sqrtRateX96 = getSqrtPrice(1)
  }

  private coverCurrentPoint(orders: IZiOrders, currentPt: number): boolean {
    if (currentPt < orders.liquidityDeltaPoint[0])
      return false

    const liquidityNum = orders.liquidityDeltaPoint.length
    if (currentPt > orders.liquidityDeltaPoint[liquidityNum - 1])
      return false

    return true
  }

  private findLeftCursor(orders: IZiOrders, currentPoint: number): Cursor {
    const liquidityIdx = findLeft(orders.liquidityDeltaPoint, currentPoint, FindLeftOperator.LESS_THAN_OR_EQUAL)
    const sellingIdx = findLeft(orders.sellingYPoint, currentPoint, FindLeftOperator.LESS_THAN_OR_EQUAL)
    const isLiquidityPoint = (liquidityIdx >= 0) && (orders.liquidityDeltaPoint[liquidityIdx] === currentPoint)
    const isLimitOrderPoint = (sellingIdx >= 0) && (orders.sellingYPoint[sellingIdx] === currentPoint)
    return { liquidityIdx, sellingIdx, currentPoint, isLimitOrderPoint, isLiquidityPoint }
  }

  private findRightCursor(orders: IZiOrders, currentPoint: number): Cursor {
    const liquidityIdx = findLeft(orders.liquidityDeltaPoint, currentPoint, FindLeftOperator.LESS_THAN_OR_EQUAL)
    const sellingIdx = findRight(orders.sellingXPoint, currentPoint, FindRightOperator.GREATER_THAN_OR_EQUAL)
    const liquidityLength = orders.liquidityDeltaPoint.length
    const isLiquidityPoint = (liquidityIdx < liquidityLength) && (orders.liquidityDeltaPoint[liquidityIdx] === currentPoint)
    const sellingLength = orders.sellingXPoint.length
    const isLimitOrderPoint = (sellingIdx < sellingLength) && (orders.sellingXPoint[sellingIdx] === currentPoint)
    return { liquidityIdx, sellingIdx, currentPoint, isLimitOrderPoint, isLiquidityPoint }
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    let amountInBN = getBigNumber(amountIn)
    let amountX = 0
    let amountY = 0
    const st = { ...this.state }
    invariant(this.coverCurrentPoint(this.orders, st.currentPoint), 'IZI: CurrentOutOfRange')
    let finished = false
    const sqrtRateX96 = this.sqrtRateX96
    const pointDelta = this.pointDelta
    let currentCursor = direction
      ? this.findLeftCursor(this.orders, st.currentPoint)
      : this.findRightCursor(this.orders, st.currentPoint)
    const fee = this.fee
    const feeRemain = 1 - this.fee

    if (direction) {
      while (this.leftMostPt <= st.currentPoint && !finished) {
        // clear limit order first
        if (currentCursor.isLimitOrderPoint) {
          const amountNoFee = getBigNumber(getNumber(amountInBN) * feeRemain)
          if (amountNoFee.gt(0)) {
            const currY = this.orders.sellingY[currentCursor.sellingIdx]
            const { costX, acquireY } = x2YAtPrice(amountNoFee, st.sqrtPriceX96, currY)
            if (acquireY.lt(currY) || costX.gte(amountNoFee))
              finished = true
            let feeAmount = 0
            if (costX.gte(amountNoFee))
              feeAmount = getNumber(amountInBN) - getNumber(costX)
            else
              feeAmount = getNumber(costX) * fee / feeRemain
            const cost = getNumber(costX) * feeAmount
            amountInBN = amountInBN.sub(getBigNumber(cost))
            amountX += cost
            amountY += getNumber(acquireY)
          }
          else {
            finished = true
          }
        }
        if (finished)
          break
        const searchStart = st.currentPoint - 1
        if (currentCursor.isLiquidityPoint) {
          const amountNoFee = getBigNumber(getNumber(amountInBN) * feeRemain)
          if (amountNoFee.gt(0)) {
            if (st.liquidity.gt(0)) {
              const retState = x2YRange(
                st, st.currentPoint, sqrtRateX96, amountNoFee,
              )
              finished = retState.finished
              let feeAmount = 0
              if (retState.costX.gte(amountNoFee))
                feeAmount = getNumber(amountInBN) - getNumber(retState.costX)
              else
                feeAmount = getNumber(retState.costX) * fee / feeRemain
              const cost = getNumber(retState.costX) + feeAmount
              amountX += cost
              amountY += getNumber(retState.acquireY)
              amountInBN = amountInBN.sub(getBigNumber(cost))
              st.currentPoint = retState.finalPt
              st.sqrtPriceX96 = retState.sqrtFinalPriceX96
              st.liquidityX = retState.liquidityX
            }
            if (!finished) {
              st.currentPoint--
              if (st.currentPoint < this.leftMostPt)
                break
              st.sqrtPriceX96 = getSqrtPrice(st.currentPoint)
              currentCursor = findLeftFromCursor(this.orders, currentCursor, st.currentPoint)
              st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
              st.liquidityX = BigNumber.from(0)
            }
          }
        }
        if (finished || st.currentPoint < this.leftMostPt)
          break
        currentCursor = findLeftFromCursor(this.orders, currentCursor, searchStart)
        const nextPt = Math.max(
          this.leftMostPt,
          nearestLeftOneOrBoundary(this.orders, currentCursor, searchStart, pointDelta),
        )
        if (st.liquidity.eq(0)) {
          st.currentPoint = nextPt
          st.sqrtPriceX96 = getSqrtPrice(st.currentPoint)
          currentCursor = findLeftFromCursor(this.orders, currentCursor, st.currentPoint)
        }
        else {
          const amountNoFee = getBigNumber(getNumber(amountInBN) * feeRemain)
          if (amountNoFee.gt(0)) {
            const retState = x2YRange(
              st, nextPt, sqrtRateX96, amountNoFee,
            )
            finished = retState.finished
            let feeAmount = 0
            if (retState.costX.gte(amountNoFee))
              feeAmount = getNumber(amountInBN) - getNumber(retState.costX)
            else
              feeAmount = getNumber(retState.costX) * fee / feeRemain
            amountY += getNumber(retState.acquireY)
            const cost = getNumber(retState.costX) + feeAmount
            amountX += cost
            amountInBN = amountInBN.sub(getBigNumber(cost))
            st.currentPoint = retState.finalPt
            st.sqrtPriceX96 = retState.sqrtFinalPriceX96
            st.liquidityX = retState.liquidityX
          }
          else {
            finished = true
          }
          currentCursor = findLeftFromCursor(this.orders, currentCursor, st.currentPoint)
          st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
        }
        if (st.currentPoint <= this.leftMostPt)
          break
      }
    }
    else {
      while (st.currentPoint < this.rightMostPt && !finished) {
        if (currentCursor.isLimitOrderPoint) {
          const amountNoFee = getBigNumber(getNumber(amountInBN) * feeRemain)
          if (amountNoFee.gt(0)) {
            const currX = this.orders.sellingX[currentCursor.sellingIdx]
            const { costY, acquireX } = y2XAtPrice(
              amountNoFee, st.sqrtPriceX96, currX,
            )
            if (acquireX < currX || costY.gte(amountNoFee))
              finished = true
            let feeAmount = 0
            if (costY.gte(amountNoFee))
              feeAmount = getNumber(amountInBN) - getNumber(costY)
            else
              feeAmount = getNumber(costY) * fee / feeRemain
            const cost = getNumber(costY) + feeAmount
            amountInBN = amountInBN.sub(getBigNumber(cost))
            amountY += cost
            amountX += getNumber(acquireX)
          }
          else {
            finished = true
          }
        }
        if (finished)
          break
        const nextPoint = Math.min(
          nearestRightOneOrBoundary(
            this.orders, currentCursor, st.currentPoint, pointDelta,
          ),
          this.rightMostPt,
        )
        if (st.liquidity.eq(0)) {
          st.currentPoint = nextPoint
          st.sqrtPriceX96 = getSqrtPrice(st.currentPoint)
          currentCursor = findRightFromCursor(this.orders, currentCursor, st.currentPoint)
          st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
          st.liquidityX = st.liquidity
        }
        else {
          const amountNoFee = getBigNumber(getNumber(amountInBN) * feeRemain)
          if (amountNoFee.gt(0)) {
            const retState = y2XRange(
              st, nextPoint, sqrtRateX96, amountNoFee,
            )
            finished = retState.finished

            let feeAmount = 0
            if (retState.costY.gte(amountNoFee))
              feeAmount = getNumber(amountInBN) - getNumber(retState.costY)
            else
              feeAmount = getNumber(retState.costY) * fee / feeRemain

            const cost = getNumber(retState.costY) + feeAmount

            amountX += getNumber(retState.acquireX)
            amountY += cost
            amountInBN = amountInBN.sub(getBigNumber(cost))

            st.currentPoint = retState.finalPt
            st.sqrtPriceX96 = retState.sqrtFinalPriceX96
            st.liquidityX = retState.liquidityX
          }
          else {
            finished = true
          }
          if (st.currentPoint === nextPoint) {
            currentCursor = findRightFromCursor(this.orders, currentCursor, st.currentPoint)
            st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
            st.liquidityX = st.liquidity
          }
          else {
            // not necessary, because retState.finished must be true
            finished = true
          }
        }
      }
    }

    const amountOut = direction ? amountY : amountX
    const outTokenReserve = direction ? getNumber(this.reserve1) : getNumber(this.reserve0)
    if (amountOut >= outTokenReserve)
      return { output: 0, gasSpent: this.swapGasCost }
    return { output: amountOut, gasSpent: this.swapGasCost }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    let amountOutBN = getBigNumber(amountOut)
    const outTokenReserve = direction ? this.reserve1 : this.reserve0
    if (amountOutBN.gte(outTokenReserve))
      return { input: 0, gasSpent: this.swapGasCost }

    let amountX = 0
    let amountY = 0
    const st = { ...this.state }
    invariant(this.coverCurrentPoint(this.orders, st.currentPoint), 'IZI: CurrentOutOfRange')
    let finished = false
    const sqrtRateX96 = this.sqrtRateX96
    const pointDelta = this.pointDelta
    let currentCursor = direction
      ? this.findLeftCursor(this.orders, st.currentPoint)
      : this.findRightCursor(this.orders, st.currentPoint)
    const fee = this.fee
    const feeRemain = 1 - this.fee

    if (direction) {
      while (this.leftMostPt <= st.currentPoint && !finished) {
        // clear limit order first
        if (currentCursor.isLimitOrderPoint) {
          const currY = this.orders.sellingY[currentCursor.sellingIdx]
          const { costX, acquireY } = x2YDesireAtPrice(
            amountOutBN, st.sqrtPriceX96, currY,
          )
          if (acquireY.gte(amountOutBN))
            finished = true

          const feeAmount = getNumber(costX) * fee / feeRemain
          const cost = getNumber(costX) + feeAmount
          amountOutBN = amountOutBN.sub(acquireY)
          amountX += cost
          amountY += getNumber(acquireY)
        }
        if (finished)
          break
        const searchStart = st.currentPoint - 1
        if (currentCursor.isLiquidityPoint) {
          if (st.liquidity.gt(0)) {
            const retState = x2YDesireRange(
              st, st.currentPoint, sqrtRateX96, amountOutBN,
            )
            finished = retState.finished
            const feeAmount = getNumber(retState.costX) * fee / feeRemain
            const cost = getNumber(retState.costX) + feeAmount
            amountX += cost
            amountY += getNumber(retState.acquireY)
            amountOutBN = amountOutBN.sub(retState.acquireY)
            st.currentPoint = retState.finalPt
            st.sqrtPriceX96 = retState.sqrtFinalPriceX96
            st.liquidityX = retState.liquidityX
          }
          if (!finished) {
            st.currentPoint--
            if (st.currentPoint < this.leftMostPt)
              break
            st.sqrtPriceX96 = getSqrtPrice(st.currentPoint)
            currentCursor = findLeftFromCursor(this.orders, currentCursor, st.currentPoint)
            st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
            st.liquidityX = BigNumber.from(0)
          }
        }

        if (finished || st.currentPoint < this.leftMostPt)
          break

        currentCursor = findLeftFromCursor(this.orders, currentCursor, searchStart)
        const nextPt = Math.max(
          this.leftMostPt,
          nearestLeftOneOrBoundary(this.orders, currentCursor, searchStart, pointDelta),
        )

        if (st.liquidity.eq(0)) {
          st.currentPoint = nextPt
          st.sqrtPriceX96 = getSqrtPrice(st.currentPoint)
          currentCursor = findLeftFromCursor(this.orders, currentCursor, st.currentPoint)
        }
        else {
          const retState = x2YDesireRange(
            st, nextPt, sqrtRateX96, amountOutBN,
          )
          finished = retState.finished
          const feeAmount = getNumber(retState.costX) * fee / feeRemain
          amountY += getNumber(retState.acquireY)
          const cost = getNumber(retState.costX) + feeAmount
          amountX += cost
          amountOutBN = amountOutBN.sub(retState.acquireY)
          st.currentPoint = retState.finalPt
          st.sqrtPriceX96 = retState.sqrtFinalPriceX96
          st.liquidityX = retState.liquidityX
          currentCursor = findLeftFromCursor(this.orders, currentCursor, st.currentPoint)
          st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
        }
        if (st.currentPoint <= this.leftMostPt)
          break
      }
    }
    else {
      while (st.currentPoint < this.rightMostPt && !finished) {
        if (currentCursor.isLimitOrderPoint) {
          const currX = this.orders.sellingX[currentCursor.sellingIdx]
          const { costY, acquireX } = y2XDesireAtPrice(
            amountOutBN, st.sqrtPriceX96, currX,
          )
          if (acquireX.gte(amountOutBN))
            finished = true

          const feeAmount = getNumber(costY) * fee / feeRemain
          const cost = getNumber(costY) + feeAmount
          amountOutBN = amountOutBN.sub(acquireX)
          amountY += cost
          amountX += getNumber(acquireX)
        }
        if (finished)
          break

        const nextPoint = Math.min(
          nearestRightOneOrBoundary(
            this.orders, currentCursor, st.currentPoint, pointDelta,
          ),
          this.rightMostPt,
        )
        if (st.liquidity.eq(0)) {
          st.currentPoint = nextPoint
          st.sqrtPriceX96 = getSqrtPrice(st.currentPoint)
          currentCursor = findRightFromCursor(this.orders, currentCursor, st.currentPoint)
          st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
          st.liquidityX = st.liquidity
        }
        else {
          const retState = y2XDesireRange(
            st, nextPoint, sqrtRateX96, amountOutBN,
          )
          finished = retState.finished

          const feeAmount = getNumber(retState.costY) * fee / feeRemain
          const cost = getNumber(retState.costY) + feeAmount
          amountX += getNumber(retState.acquireX)
          amountY += cost
          amountOutBN = amountOutBN.sub(retState.acquireX)

          st.currentPoint = retState.finalPt
          st.sqrtPriceX96 = retState.sqrtFinalPriceX96
          st.liquidityX = retState.liquidityX

          if (st.currentPoint === nextPoint) {
            currentCursor = findRightFromCursor(this.orders, currentCursor, st.currentPoint)
            st.liquidity = this.orders.liquidity[currentCursor.liquidityIdx]
            st.liquidityX = st.liquidity
          }
          else {
            // not necessary, because retState.finished must be true
            finished = true
          }
        }
      }
    }

    return { input: direction ? amountX : amountY, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const currentPrice = getNumber(this.state.sqrtPriceX96) / getNumber(two96)
    const p = currentPrice * currentPrice
    return direction ? p : 1 / p
  }
}
