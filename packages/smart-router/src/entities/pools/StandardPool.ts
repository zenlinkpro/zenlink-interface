import type { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '../BaseToken'
import { BasePool } from './BasePool'

export class StandardPool extends BasePool {
  public reserve0Number: number
  public reserve1Number: number

  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.reserve0Number = parseInt(reserve0.toString())
    this.reserve1Number = parseInt(reserve1.toString())
  }

  public updateReserves(res0: BigNumber, res1: BigNumber) {
    this.reserve0 = res0
    this.reserve0Number = parseInt(res0.toString())
    this.reserve1 = res1
    this.reserve1Number = parseInt(res1.toString())
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const output = (y * amountIn) / (x / (1 - this.fee) + amountIn)
    if (y - output < this.minLiquidity)
      throw new Error('CP OutOfLiquidity')
    return { output, gasSpent: this.swapGasCost }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    if (y - amountOut < this.minLiquidity)
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    const input = (x * amountOut) / (1 - this.fee) / (y - amountOut)
    return { input, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    return this.calcPrice(0, direction, false)
  }

  public calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const oneMinusFee = takeFeeIntoAccount ? 1 - this.fee : 1
    const xf = x / oneMinusFee
    return (y * xf) / (xf + amountIn) / (xf + amountIn)
  }

  public calcInputByPrice(price: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const oneMinusFee = takeFeeIntoAccount ? 1 - this.fee : 1
    const xf = x / oneMinusFee
    return Math.sqrt(y * xf * price) - xf
  }

  public getLiquidity(): number {
    return Math.sqrt(this.reserve0Number * this.reserve1Number)
  }
}
