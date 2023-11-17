import type { BigNumber } from '@ethersproject/bignumber'
import type { Token } from '@zenlink-interface/currency'
import type { BaseToken } from '@zenlink-interface/amm'
import { getNumber } from '../../util'
import { BasePool } from './BasePool'

export class SyncPool extends BasePool {
  private readonly reserve0Number: number
  private readonly reserve1Number: number
  private readonly token0PrecisionMultiplier: number
  private readonly token1PrecisionMultiplier: number
  private readonly isStable: boolean

  public constructor(
    address: string,
    token0: Token,
    token1: Token,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    isStable: boolean,
  ) {
    super(address, token0 as BaseToken, token1 as BaseToken, fee, reserve0, reserve1)
    this.reserve0Number = getNumber(reserve0)
    this.reserve1Number = getNumber(reserve1)
    this.token0PrecisionMultiplier = 10 ** (18 - token0.decimals)
    this.token1PrecisionMultiplier = 10 ** (18 - token1.decimals)
    this.isStable = isStable
  }

  private getY(x: number, d: number): number {
    let c = (d * d) / (x * 2)
    c = (c * d) / 4000
    const b = x + (d / 2000)
    let yPrev = 0
    let y = d

    for (let i = 0; i < 256;) {
      yPrev = y
      y = (y * y + c) / (y * 2 + b - d)
      if (Math.abs(y - yPrev) <= 1)
        break
      ++i
    }
    return y
  }

  private computeDFromAdjustedBalances(xp0: number, xp1: number): number {
    const s = xp0 + xp1

    if (s === 0) {
      return 0
    }
    else {
      let prevD = 0
      let d = s

      for (let i = 0; i < 256;) {
        const dP = (((d * d) / xp0) * d) / xp1 / 4
        prevD = d
        d = (((2000 * s) + 2 * dP) * d) / ((2000 - 1) * d + 3 * dP)
        if (Math.abs(d - prevD) <= 1)
          break
        ++i
      }
      return d
    }
  }

  public getOutput(amountIn: number, direction: boolean): { output: number, gasSpent: number } {
    let outputAmount = 0
    if (this.isStable) {
      const adjustedReserve0 = this.reserve0Number * this.token0PrecisionMultiplier
      const adjustedReserve1 = this.reserve1Number * this.token1PrecisionMultiplier
      const feeIn = amountIn * this.fee
      const feeDeductedAmountIn = amountIn - feeIn
      const d = this.computeDFromAdjustedBalances(adjustedReserve0, adjustedReserve1)
      if (direction) {
        const x = adjustedReserve0 + feeDeductedAmountIn * this.token0PrecisionMultiplier
        const y = this.getY(x, d)
        outputAmount = adjustedReserve1 - y - 1
        outputAmount /= this.token1PrecisionMultiplier
      }
      else {
        const x = adjustedReserve1 + feeDeductedAmountIn * this.token1PrecisionMultiplier
        const y = this.getY(x, d)
        outputAmount = adjustedReserve0 - y - 1
        outputAmount /= this.token0PrecisionMultiplier
      }
    }
    else {
      const x = direction ? this.reserve0Number : this.reserve1Number
      const y = direction ? this.reserve1Number : this.reserve0Number
      outputAmount = (y * amountIn) / (x / (1 - this.fee) + amountIn)
    }

    return { output: outputAmount, gasSpent: this.swapGasCost }
  }

  public getInput(amountOut: number, direction: boolean): { input: number, gasSpent: number } {
    const reserveNumber = direction ? this.reserve1Number : this.reserve0Number
    if (reserveNumber - amountOut < this.minLiquidity)
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    let inputAmount = 0
    if (this.isStable) {
      const adjustedReserve0 = this.reserve0Number * this.token0PrecisionMultiplier
      const adjustedReserve1 = this.reserve1Number * this.token1PrecisionMultiplier
      const d = this.computeDFromAdjustedBalances(adjustedReserve0, adjustedReserve1)
      if (direction) {
        const y = adjustedReserve1 - amountOut * this.token1PrecisionMultiplier
        if (y <= 1)
          return { input: 1, gasSpent: this.swapGasCost }
        const x = this.getY(y, d)
        inputAmount = (x - adjustedReserve0) / (1 - this.fee) + 1
        inputAmount /= this.token0PrecisionMultiplier
      }
      else {
        const y = adjustedReserve0 - amountOut * this.token0PrecisionMultiplier
        if (y <= 1)
          return { input: 1, gasSpent: this.swapGasCost }
        const x = this.getY(y, d)
        inputAmount = (x - adjustedReserve1) / (1 - this.fee) + 1
        inputAmount /= this.token1PrecisionMultiplier
      }
    }
    else {
      const x = direction ? this.reserve0Number : this.reserve1Number
      const y = direction ? this.reserve1Number : this.reserve0Number
      inputAmount = (x * amountOut) / (1 - this.fee) / (y - amountOut)
    }

    return { input: inputAmount, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    if (this.isStable) {
      const amountIn = direction
        ? (10 ** 18) / this.token0PrecisionMultiplier
        : (10 ** 18) / this.token1PrecisionMultiplier
      return this.getOutput(amountIn, direction).output / (1 - this.fee) / amountIn
    }
    else {
      const x = direction ? this.reserve0Number : this.reserve1Number
      const y = direction ? this.reserve1Number : this.reserve0Number
      return (y * x) / x / x
    }
  }
}
