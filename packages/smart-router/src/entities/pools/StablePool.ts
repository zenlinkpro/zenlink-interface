import type { BaseToken, StableSwap } from '@zenlink-interface/amm'
import type { Token } from '@zenlink-interface/currency'
import { ONE } from '@zenlink-interface/math'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { getBigNumber } from '../../util'
import { BasePool } from './BasePool'

const FEE_DENOMINATOR = JSBI.BigInt(1e10)

export class StablePool extends BasePool {
  public swap: StableSwap
  public token0Index: number
  public token1Index: number

  public constructor(
    swap: StableSwap,
    token0: Token,
    token1: Token,
    fee: number,
  ) {
    const token0Index = swap.getTokenIndex(token0)
    const token1Index = swap.getTokenIndex(token1)
    super(
      swap.contractAddress,
      token0 as BaseToken,
      token1 as BaseToken,
      fee,
      BigNumber.from(swap.balances[token0Index].quotient.toString()),
      BigNumber.from(swap.balances[token1Index].quotient.toString()),
    )
    this.swap = swap
    this.token0Index = token0Index
    this.token1Index = token1Index
  }

  public updateSwap(swap: StableSwap) {
    invariant(swap.contractAddress === this.swap.contractAddress, 'StablePool: Different pool!')
    this.swap = swap
    const res0 = BigNumber.from(swap.balances[this.token0Index].quotient.toString())
    const res1 = BigNumber.from(swap.balances[this.token1Index].quotient.toString())
    if (!res0.eq(this.reserve0) || !res1.eq(this.reserve1))
      this.updateReserves(res0, res1)
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    const inIndex = direction ? this.token0Index : this.token1Index
    const outIndex = direction ? this.token1Index : this.token0Index
    const inAmountBN = getBigNumber(amountIn)
    const normalizedBalances = this.swap.xp
    const newInBalance = JSBI.add(
      normalizedBalances[inIndex],
      JSBI.multiply(JSBI.BigInt(inAmountBN.toString()), this.swap.tokenMultipliers[inIndex]),
    )
    const outBalance = this.swap._getY(inIndex, outIndex, newInBalance, normalizedBalances)
    const outAmount = JSBI.divide(
      JSBI.subtract(JSBI.subtract(normalizedBalances[outIndex], outBalance), ONE),
      this.swap.tokenMultipliers[outIndex],
    )
    const fee = JSBI.divide(JSBI.multiply(this.swap.swapFee, outAmount), FEE_DENOMINATOR)
    return {
      output: Number.parseInt(JSBI.subtract(outAmount, fee).toString()),
      gasSpent: this.swapGasCost,
    }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    const inIndex = direction ? this.token0Index : this.token1Index
    const outIndex = direction ? this.token1Index : this.token0Index
    const outAmountBN = getBigNumber(amountOut)
    const normalizedBalances = this.swap.xp
    let newOutBalance = JSBI.subtract(
      normalizedBalances[outIndex],
      JSBI.multiply(JSBI.BigInt(outAmountBN.toString()), this.swap.tokenMultipliers[outIndex]),
    )
    if (JSBI.lessThan(newOutBalance, ONE))
      // lack of precision
      newOutBalance = ONE
    const inNewBalance = this.swap._getY(outIndex, inIndex, newOutBalance, normalizedBalances)
    const inAmount = JSBI.divide(
      JSBI.add(JSBI.subtract(inNewBalance, normalizedBalances[inIndex]), ONE),
      this.swap.tokenMultipliers[inIndex],
    )
    const inAmountWithFee = JSBI.divide(
      inAmount,
      JSBI.subtract(ONE, JSBI.divide(this.swap.swapFee, FEE_DENOMINATOR)),
    )
    return {
      input: Number.parseInt(inAmountWithFee.toString()),
      gasSpent: this.swapGasCost,
    }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const inIndex = direction ? this.token0Index : this.token1Index
    return this.calcPrice(10 ** this.swap.getToken(inIndex).decimals, direction)
  }

  public calcPrice(amountIn: number, direction: boolean): number {
    invariant(amountIn !== 0, 'StablePool: Invalid zero amountIn')
    const inIndex = direction ? this.token0Index : this.token1Index
    const outIndex = direction ? this.token1Index : this.token0Index
    const normalizedBalances = this.swap.xp
    const inAmount = JSBI.add(
      normalizedBalances[inIndex],
      JSBI.multiply(JSBI.BigInt(getBigNumber(amountIn)), this.swap.tokenMultipliers[inIndex]),
    )
    const outBalance = this.swap._getY(
      inIndex,
      outIndex,
      inAmount,
      normalizedBalances,
    )
    const outAmount = JSBI.divide(
      JSBI.subtract(JSBI.subtract(normalizedBalances[outIndex], outBalance), ONE),
      this.swap.tokenMultipliers[outIndex],
    )
    return Number.parseInt(outAmount.toString()) / amountIn
  }
}
