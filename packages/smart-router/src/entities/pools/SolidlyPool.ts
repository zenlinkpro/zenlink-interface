import type { BaseToken } from '@zenlink-interface/amm'
import type { BigNumber } from '@ethersproject/bignumber'
import type { Token } from '@zenlink-interface/currency'
import { BasePool } from './BasePool'

export class SolidlyPool extends BasePool {
  public reserve0Number: number
  public reserve1Number: number
  private readonly isStable: boolean
  private readonly decimals0: number
  private readonly decimals1: number

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
    this.reserve0Number = Number.parseInt(reserve0.toString())
    this.reserve1Number = Number.parseInt(reserve1.toString())
    this.isStable = isStable
    this.decimals0 = 10 ** token0.decimals
    this.decimals1 = 10 ** token1.decimals
  }

  private k(x: number, y: number): number {
    if (this.isStable) {
      x = x * 1e18 / this.decimals0
      y = y * 1e18 / this.decimals1
      const a = (x * y) / 1e18
      const b = (x * x) / 1e18 + (y * y) / 1e18
      return (a * b) / 1e18
    }
    else {
      return x * y
    }
  }

  private f(x0: number, y: number): number {
    return x0 * (y * y / 1e18 * y / 1e18) / 1e18 + (x0 * x0 / 1e18 * x0 / 1e18) * y / 1e18
  }

  private d(x0: number, y: number): number {
    return 3 * x0 * (y * y / 1e18) / 1e18 + (x0 * x0 / 1e18 * x0 / 1e18)
  }

  private getY(x0: number, xy: number, y: number): number {
    for (let i = 0; i < 256; i++) {
      const k = this.f(x0, y)
      if (k < xy) {
        let dy = (xy - k) * 1e18 / this.d(x0, y)
        if (dy === 0) {
          if (k === xy) {
            // We found the correct answer. Return y
            return y
          }
          if (this.k(x0, y + 1) > xy) {
            // If _k(x0, y + 1) > xy, then we are close to the correct answer.
            // There's no closer answer than y + 1
            return y + 1
          }
          dy = 1
        }
        y = y + dy
      }
      else {
        let dy = ((k - xy) * 1e18) / this.d(x0, y)
        if (dy === 0) {
          if (k === xy || this.f(x0, y - 1) < xy) {
            // Likewise, if k == xy, we found the correct answer.
            // If _f(x0, y - 1) < xy, then we are close to the correct answer.
            // There's no closer answer than "y"
            // It's worth mentioning that we need to find y where f(x0, y) >= xy
            // As a result, we can't return y - 1 even it's closer to the correct answer
            return y
          }
          dy = 1
        }
        y = y - dy
      }
    }
    return 0
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    amountIn = amountIn * (1 - this.fee)
    let outputAmount = 0
    if (this.isStable) {
      const xy = this.k(this.reserve0Number, this.reserve1Number)
      const reserve0 = this.reserve0Number * 1e18 / this.decimals0
      const reserve1 = this.reserve1Number * 1e18 / this.decimals1

      const [reserveA, reserveB] = direction ? [reserve0, reserve1] : [reserve1, reserve0]
      amountIn = direction ? amountIn * 1e18 / this.decimals0 : amountIn * 1e18 / this.decimals1
      const y = reserveB - this.getY(amountIn + reserveA, xy, reserveB)
      outputAmount = (y * (direction ? this.decimals1 : this.decimals0)) / 1e18
    }
    else {
      const [reserveA, reserveB] = direction
        ? [this.reserve0Number, this.reserve1Number]
        : [this.reserve1Number, this.reserve0Number]
      outputAmount = (amountIn * reserveB) / (reserveA + amountIn)
    }

    return { output: outputAmount, gasSpent: this.swapGasCost }
  }

  public getInput(_amountOut: number, _direction: boolean): { input: number; gasSpent: number } {
    return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const amountIn = direction ? 10 ** this.decimals0 : 10 ** this.decimals1
    return this.getOutput(amountIn, direction).output / (1 - this.fee) / amountIn
  }
}
