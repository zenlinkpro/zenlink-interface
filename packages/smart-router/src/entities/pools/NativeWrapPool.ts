import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '../BaseToken'
import { BasePool } from './BasePool'

export class NatvieWrapPool extends BasePool {
  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    swapGasCost = 150_000,
  ) {
    super(
      address,
      token0,
      token1,
      fee,
      BigNumber.from(-1),
      BigNumber.from(-1),
      0,
      swapGasCost,
    )
  }

  public getOutput(amountIn: number, _direction: boolean): { output: number; gasSpent: number } {
    return { output: amountIn * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  public getInput(amountOut: number, _direction: boolean): { input: number; gasSpent: number } {
    return { input: amountOut / (1 - this.fee), gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(_direction: boolean): number {
    return 1
  }

  public alwaysAppropriateForPricing(): boolean {
    return true
  }
}
