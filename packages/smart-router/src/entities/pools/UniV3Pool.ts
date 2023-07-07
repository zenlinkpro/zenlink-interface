import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import { BasePool } from './BasePool'

const BASE_GAS_CONSUMPTION = 70_000
const STEP_GAS_CONSUMPTION = 30_000

const ZERO = BigNumber.from(0)
const c01 = BigNumber.from('0xfffcb933bd6fad37aa2d162d1a594001')
const c02 = BigNumber.from('0x100000000000000000000000000000000')
const c03 = BigNumber.from('0xfff97272373d413259a46990580e213a')
const c04 = BigNumber.from('0xfff2e50f5f656932ef12357cf3c7fdcc')
const c05 = BigNumber.from('0xffe5caca7e10e4e61c3624eaa0941cd0')
const c06 = BigNumber.from('0xffcb9843d60f6159c9db58835c926644')
const c07 = BigNumber.from('0xff973b41fa98c081472e6896dfb254c0')
const c08 = BigNumber.from('0xff2ea16466c96a3843ec78b326b52861')
const c09 = BigNumber.from('0xfe5dee046a99a2a811c461f1969c3053')
const c10 = BigNumber.from('0xfcbe86c7900a88aedcffc83b479aa3a4')
const c11 = BigNumber.from('0xf987a7253ac413176f2b074cf7815e54')
const c12 = BigNumber.from('0xf3392b0822b70005940c7a398e4b70f3')
const c13 = BigNumber.from('0xe7159475a2c29b7443b29c7fa6e889d9')
const c14 = BigNumber.from('0xd097f3bdfd2022b8845ad8f792aa5825')
const c15 = BigNumber.from('0xa9f746462d870fdf8a65dc1f90e061e5')
const c16 = BigNumber.from('0x70d869a156d2a1b890bb3df62baf32f7')
const c17 = BigNumber.from('0x31be135f97d08fd981231505542fcfa6')
const c18 = BigNumber.from('0x9aa508b5b7a84e1c677de54f3e99bc9')
const c19 = BigNumber.from('0x5d6af8dedb81196699c329225ee604')
const c20 = BigNumber.from('0x2216e584f5fa1ea926041bedfe98')
const c21 = BigNumber.from('0x48a170391f7dc42444e8fa2')
const max256 = BigNumber.from(2).pow(256).sub(1)

function getSqrtRatioAtTick(tick: number): BigNumber {
  const absTick = Math.abs(tick)
  let ratio: BigNumber = (absTick & 0x1) !== 0 ? c01 : c02
  if ((absTick & 0x2) !== 0)
    ratio = ratio.mul(c03).shr(128)
  if ((absTick & 0x4) !== 0)
    ratio = ratio.mul(c04).shr(128)
  if ((absTick & 0x8) !== 0)
    ratio = ratio.mul(c05).shr(128)
  if ((absTick & 0x10) !== 0)
    ratio = ratio.mul(c06).shr(128)
  if ((absTick & 0x20) !== 0)
    ratio = ratio.mul(c07).shr(128)
  if ((absTick & 0x40) !== 0)
    ratio = ratio.mul(c08).shr(128)
  if ((absTick & 0x80) !== 0)
    ratio = ratio.mul(c09).shr(128)
  if ((absTick & 0x100) !== 0)
    ratio = ratio.mul(c10).shr(128)
  if ((absTick & 0x200) !== 0)
    ratio = ratio.mul(c11).shr(128)
  if ((absTick & 0x400) !== 0)
    ratio = ratio.mul(c12).shr(128)
  if ((absTick & 0x800) !== 0)
    ratio = ratio.mul(c13).shr(128)
  if ((absTick & 0x1000) !== 0)
    ratio = ratio.mul(c14).shr(128)
  if ((absTick & 0x2000) !== 0)
    ratio = ratio.mul(c15).shr(128)
  if ((absTick & 0x4000) !== 0)
    ratio = ratio.mul(c16).shr(128)
  if ((absTick & 0x8000) !== 0)
    ratio = ratio.mul(c17).shr(128)
  if ((absTick & 0x10000) !== 0)
    ratio = ratio.mul(c18).shr(128)
  if ((absTick & 0x20000) !== 0)
    ratio = ratio.mul(c19).shr(128)
  if ((absTick & 0x40000) !== 0)
    ratio = ratio.mul(c20).shr(128)
  if ((absTick & 0x80000) !== 0)
    ratio = ratio.mul(c21).shr(128)

  if (tick > 0)
    ratio = max256.div(ratio)
  // This divides by 1<<32 rounding up to go from a Q128.128 to a Q128.96.
  // We then downcast because we know the result always fits within 160 bits due to our tick input constraint.
  // We round up in the division so getTickAtSqrtRatio of the output price is always consistent.
  // sqrtPriceX96 = uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));
  return ratio.shr(32)
}

const two96 = 2 ** 96

export const UNIV3_MIN_TICK = -887272
export const UNIV3_MAX_TICK = -UNIV3_MIN_TICK - 1
export interface UniV3Tick {
  index: number
  DLiquidity: BigNumber
}

export class UniV3Pool extends BasePool {
  public liquidity: BigNumber
  public sqrtPriceX96: BigNumber
  public nearestTick: number
  public readonly ticks: UniV3Tick[]

  /// @param address The address of the pool
  /// @param token0 The first token of the pool
  /// @param token1 The secons token of the pool
  /// @param fee Pool's fee in fractions of 1. fee=0.003 means 0.3%
  /// @param reserve0 Pool's reserve of token0 - await token0.balanceOf(pool.address)
  /// @param reserve1 Pool's reserve of token1 - await token1.balanceOf(pool.address)
  /// @param tick Currenct pool tick - (await pool.slot0())[1]
  /// @param liquidity Current pool liquidity - await pool.liquidity()
  /// @param sqrtPriceX96 Square root of the current pool price multiplied 2^96 - (await pool.slot0())[0]
  /// @param ticks The list of all initialized ticks, sorted by index from low ho high
  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    tick: number,
    liquidity: BigNumber,
    sqrtPriceX96: BigNumber,
    ticks: UniV3Tick[],
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.ticks = ticks
    if (this.ticks.length === 0) {
      this.ticks.push({ index: UNIV3_MIN_TICK, DLiquidity: ZERO })
      this.ticks.push({ index: UNIV3_MAX_TICK, DLiquidity: ZERO })
    }
    if (this.ticks[0].index > UNIV3_MIN_TICK)
      this.ticks.unshift({ index: UNIV3_MIN_TICK, DLiquidity: ZERO })
    if (this.ticks[this.ticks.length - 1].index < UNIV3_MAX_TICK)
      this.ticks.push({ index: UNIV3_MAX_TICK, DLiquidity: ZERO })

    this.liquidity = liquidity
    this.sqrtPriceX96 = sqrtPriceX96
    this.nearestTick = this._findTickForPrice(tick)
  }

  public updateState(
    reserve0: BigNumber,
    reserve1: BigNumber,
    tick: number,
    liquidity: BigNumber,
    sqrtPriceX96: BigNumber,
  ) {
    this.updateReserves(reserve0, reserve1)
    this.liquidity = liquidity
    this.sqrtPriceX96 = sqrtPriceX96
    this.nearestTick = this._findTickForPrice(tick)
  }

  private _findTickForPrice(tick: number): number {
    let a = 0
    let b = this.ticks.length
    while (b - a > 1) {
      const c = Math.floor((a + b) / 2)
      const ind = this.ticks[c].index
      if (ind === tick)
        return c
      if (ind < tick)
        a = c
      else b = c
    }
    return a
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    let nextTickToCross = direction ? this.nearestTick : this.nearestTick + 1
    const currentPriceBN = this.sqrtPriceX96
    let currentPrice = Number.parseInt(currentPriceBN.toString()) / two96
    let currentLiquidityBN = this.liquidity
    let outAmount = 0
    let input = amountIn * (1 - this.fee)

    let stepCounter = 0
    let startFlag = true
    while (input > 0) {
      if (nextTickToCross < 0 || nextTickToCross >= this.ticks.length)
        return { output: outAmount, gasSpent: this.swapGasCost }

      let nextTickPrice: number
      let priceDiff: number
      if (startFlag) {
        // Increasing precision at first step only - otherwise its too slow
        const nextTickPriceBN = getSqrtRatioAtTick(this.ticks[nextTickToCross].index)
        nextTickPrice = Number.parseInt(nextTickPriceBN.toString()) / two96
        priceDiff = Number.parseInt(currentPriceBN.sub(nextTickPriceBN).toString()) / two96
        startFlag = false
      }
      else {
        nextTickPrice = Math.sqrt(1.0001 ** this.ticks[nextTickToCross].index)
        priceDiff = currentPrice - nextTickPrice
      }

      let output = 0
      const currentLiquidity = Number.parseInt(currentLiquidityBN.toString())

      if (direction) {
        const maxDx = (currentLiquidity * priceDiff) / currentPrice / nextTickPrice

        if (input <= maxDx) {
          output = (currentLiquidity * currentPrice * input) / (input + currentLiquidity / currentPrice)
          input = 0
        }
        else {
          output = currentLiquidity * priceDiff
          currentPrice = nextTickPrice
          input -= maxDx
          currentLiquidityBN = currentLiquidityBN.sub(this.ticks[nextTickToCross].DLiquidity)
          nextTickToCross--
          if (nextTickToCross === 0)
            currentLiquidityBN = ZERO // Protection if we know not all ticks
        }
      }
      else {
        const maxDy = currentLiquidity * -priceDiff
        if (input <= maxDy) {
          output = input / currentPrice / (currentPrice + input / currentLiquidity)
          input = 0
        }
        else {
          output = (currentLiquidity * -priceDiff) / currentPrice / nextTickPrice
          currentPrice = nextTickPrice
          input -= maxDy
          currentLiquidityBN = currentLiquidityBN.add(this.ticks[nextTickToCross].DLiquidity)
          nextTickToCross++
          if (nextTickToCross === this.ticks.length - 1)
            currentLiquidityBN = ZERO // Protection if we know not all ticks
        }
      }

      outAmount += output
      ++stepCounter
    }

    return { output: outAmount, gasSpent: BASE_GAS_CONSUMPTION + STEP_GAS_CONSUMPTION * stepCounter }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    let nextTickToCross = direction ? this.nearestTick : this.nearestTick + 1
    const currentPriceBN = this.sqrtPriceX96
    let currentPrice = Number.parseInt(currentPriceBN.toString()) / two96
    let currentLiquidityBN = this.liquidity
    let input = 0
    let outBeforeFee = amountOut

    let stepCounter = 0
    let startFlag = true
    while (outBeforeFee > 0) {
      if (nextTickToCross < 0 || nextTickToCross >= this.ticks.length)
        return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

      ++stepCounter
      let nextTickPrice: number
      let priceDiff: number
      if (startFlag) {
        // Increasing precision at first step only - otherwise its too slow
        const nextTickPriceBN = getSqrtRatioAtTick(this.ticks[nextTickToCross].index)
        nextTickPrice = Number.parseInt(nextTickPriceBN.toString()) / two96
        priceDiff = Number.parseInt(currentPriceBN.sub(nextTickPriceBN).toString()) / two96
        startFlag = false
      }
      else {
        nextTickPrice = Math.sqrt(1.0001 ** this.ticks[nextTickToCross].index)
        priceDiff = currentPrice - nextTickPrice
      }

      const currentLiquidity = Number.parseInt(currentLiquidityBN.toString())

      if (direction) {
        const maxDy = currentLiquidity * priceDiff
        if (outBeforeFee <= maxDy) {
          input += outBeforeFee / currentPrice / (currentPrice - outBeforeFee / currentLiquidity)
          outBeforeFee = 0
        }
        else {
          input += (currentLiquidity * priceDiff) / currentPrice / nextTickPrice
          currentPrice = nextTickPrice
          outBeforeFee -= maxDy
          currentLiquidityBN = currentLiquidityBN.sub(this.ticks[nextTickToCross].DLiquidity)
          nextTickToCross--
          if (nextTickToCross === 0)
            currentLiquidityBN = ZERO // Protection if we know not all ticks
        }
      }
      else {
        const maxDx = (currentLiquidity * -priceDiff) / currentPrice / nextTickPrice

        if (outBeforeFee <= maxDx) {
          input += (currentLiquidity * currentPrice * outBeforeFee) / (currentLiquidity / currentPrice - outBeforeFee)
          outBeforeFee = 0
        }
        else {
          input += currentLiquidity * -priceDiff
          currentPrice = nextTickPrice
          outBeforeFee -= maxDx
          currentLiquidityBN = currentLiquidityBN.add(this.ticks[nextTickToCross].DLiquidity)
          nextTickToCross++
          if (nextTickToCross === this.ticks.length - 1)
            currentLiquidityBN = ZERO // Protection if we know not all ticks
        }
      }
    }

    return { input: input / (1 - this.fee), gasSpent: BASE_GAS_CONSUMPTION + STEP_GAS_CONSUMPTION * stepCounter }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const currentPrice = Number.parseInt(this.sqrtPriceX96.toString()) / two96
    const p = currentPrice * currentPrice
    return direction ? p : 1 / p
  }
}
