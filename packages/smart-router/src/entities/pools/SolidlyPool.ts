import type { BaseToken } from '@zenlink-interface/amm'
import type { Token } from '@zenlink-interface/currency'
import { BigNumber } from '@ethersproject/bignumber'
import { getBigNumber, getNumber } from '../../util'
import { BasePool } from './BasePool'

const COMMON_DECIMALS = BigNumber.from(10).pow(18)

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

  private k(x: BigNumber, y: BigNumber): BigNumber {
    if (this.isStable) {
      const _x = x.mul(COMMON_DECIMALS).div(getBigNumber(this.decimals0))
      const _y = y.mul(COMMON_DECIMALS).div(getBigNumber(this.decimals1))
      const _a = _x.mul(_y).div(COMMON_DECIMALS)
      const _b = _x.mul(_x).div(COMMON_DECIMALS).add(_y.mul(_y).div(COMMON_DECIMALS))
      return _a.mul(_b).div(COMMON_DECIMALS) // x3y+y3x >= k
    }
    else {
      return x.mul(y)
    }
  }

  private f(x0: BigNumber, y: BigNumber): BigNumber {
    const _a = x0.mul(y).div(COMMON_DECIMALS)
    const _b = x0.mul(x0).div(COMMON_DECIMALS).add(y.mul(y).div(COMMON_DECIMALS))
    return _a.mul(_b).div(COMMON_DECIMALS)
  }

  private d(x0: BigNumber, y: BigNumber): BigNumber {
    const _a = BigNumber.from(3).mul(x0).mul(y.mul(y).div(COMMON_DECIMALS)).div(COMMON_DECIMALS)
    const _b = x0.mul(x0).div(COMMON_DECIMALS).mul(x0).div(COMMON_DECIMALS)
    return _a.add(_b)
    // return (3 * x0 * ((y * y) / 1e18)) / 1e18 + ((((x0 * x0) / 1e18) * x0) / 1e18)
  }

  private getY(x0: BigNumber, xy: BigNumber, y: BigNumber): BigNumber {
    for (let i = 0; i < 255; i++) {
      const k = this.f(x0, y)
      if (k.lt(xy)) {
        let dy = xy.sub(k).mul(COMMON_DECIMALS).div(this.d(x0, y))
        if (dy.eq(0)) {
          if (k.eq(xy)) {
            // We found the correct answer. Return y
            return y
          }
          if (this.k(x0, y.add(1)).gt(xy)) {
            // If _k(x0, y + 1) > xy, then we are close to the correct answer.
            // There's no closer answer than y + 1
            return y.add(1)
          }
          dy = BigNumber.from(1)
        }
        y = y.add(dy)
      }
      else {
        let dy = k.sub(xy).mul(COMMON_DECIMALS).div(this.d(x0, y))
        if (dy.eq(0)) {
          if (k.eq(xy) || this.f(x0, y.sub(1)).lt(xy)) {
            // Likewise, if k == xy, we found the correct answer.
            // If _f(x0, y - 1) < xy, then we are close to the correct answer.
            // There's no closer answer than "y"
            // It's worth mentioning that we need to find y where f(x0, y) >= xy
            // As a result, we can't return y - 1 even it's closer to the correct answer
            return y
          }
          dy = BigNumber.from(1)
        }
        y = y.sub(dy)
      }
    }
    throw new Error('!y')
  }

  public getOutput(amountIn: number, direction: boolean): { output: number, gasSpent: number } {
    amountIn = amountIn * (1 - this.fee)
    let outputAmount = 0
    if (this.isStable) {
      const xy = this.k(getBigNumber(this.reserve0Number), getBigNumber(this.reserve1Number))
      const reserve0 = this.reserve0Number * 1e18 / this.decimals0
      const reserve1 = this.reserve1Number * 1e18 / this.decimals1

      const [reserveA, reserveB] = direction ? [reserve0, reserve1] : [reserve1, reserve0]
      amountIn = direction ? amountIn * 1e18 / this.decimals0 : amountIn * 1e18 / this.decimals1

      const y = reserveB - getNumber(
        this.getY(getBigNumber(amountIn + reserveA), xy, getBigNumber(reserveB)),
      )
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

  public getInput(_amountOut: number, _direction: boolean): { input: number, gasSpent: number } {
    return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const amountIn = direction ? this.decimals0 : this.decimals1
    return this.getOutput(amountIn, direction).output / (1 - this.fee) / amountIn
  }
}
