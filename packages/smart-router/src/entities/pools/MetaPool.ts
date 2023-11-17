import type { BaseToken, StableSwap } from '@zenlink-interface/amm'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { ONE } from '@zenlink-interface/math'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { getBigNumber } from '../../util'
import { BasePool } from './BasePool'

const BASE_VIRTUAL_PRICE_PRECISION = JSBI.BigInt(1e18)
const FEE_DENOMINATOR = JSBI.BigInt(1e10)

function getTokenIndexsAndBalances(
  baseSwap: StableSwap,
  metaSwap: StableSwap,
  token0: Token,
  token1: Token,
): [[number, number], [BigNumber, BigNumber]] {
  let token0Index = 0
  let balance0 = BigNumber.from(0)
  let token1Index = 0
  let balance1 = BigNumber.from(0)

  if (baseSwap.involvesToken(token0)) {
    const baseToken0Index = baseSwap.getTokenIndex(token0)
    token0Index = metaSwap.pooledTokens.length - 1 + baseToken0Index
    balance0 = BigNumber.from(baseSwap.balances[baseToken0Index].quotient.toString())
  }
  if (baseSwap.involvesToken(token1)) {
    const baseToken1Index = baseSwap.getTokenIndex(token1)
    token1Index = metaSwap.pooledTokens.length - 1 + baseToken1Index
    balance1 = BigNumber.from(baseSwap.balances[baseToken1Index].quotient.toString())
  }

  if (metaSwap.involvesToken(token0)) {
    token0Index = metaSwap.getTokenIndex(token0)
    balance0 = BigNumber.from(metaSwap.balances[token0Index].quotient.toString())
  }
  if (metaSwap.involvesToken(token1)) {
    token1Index = metaSwap.getTokenIndex(token1)
    balance1 = BigNumber.from(metaSwap.balances[token1Index].quotient.toString())
  }
  return [[token0Index, token1Index], [balance0, balance1]]
}

export class MetaPool extends BasePool {
  public baseSwap: StableSwap
  public metaSwap: StableSwap
  private _token0: Token
  private _token1: Token
  public token0Index: number
  public token1Index: number

  public constructor(
    baseSwap: StableSwap,
    metaSwap: StableSwap,
    token0: Token,
    token1: Token,
    fee: number,
  ) {
    invariant(
      metaSwap.pooledTokens.some(token => token.address.toLowerCase() === baseSwap.liquidityToken.address.toLowerCase()),
      'MetaPool: PooledTokens not including baseLiquidityToken',
    )
    const [
      [token0Index, token1Index],
      [balance0, balance1],
    ] = getTokenIndexsAndBalances(baseSwap, metaSwap, token0, token1)

    super(
      metaSwap.contractAddress,
      token0 as BaseToken,
      token1 as BaseToken,
      fee,
      balance0,
      balance1,
    )
    this.baseSwap = baseSwap
    this.metaSwap = metaSwap
    this._token0 = token0
    this._token1 = token1
    this.token0Index = token0Index
    this.token1Index = token1Index
  }

  public updateSwap(baseSwap: StableSwap, metaSwap: StableSwap) {
    invariant(
      baseSwap.contractAddress === this.baseSwap.contractAddress,
      'MetaPool: Different basePool!',
    )
    invariant(
      metaSwap.contractAddress === this.metaSwap.contractAddress,
      'MetaPool: Different metaPool!',
    )
    const [
      _,
      [res0, res1],
    ] = getTokenIndexsAndBalances(baseSwap, metaSwap, this._token0, this._token1)
    this.baseSwap = baseSwap
    this.metaSwap = metaSwap
    if (!res0.eq(this.reserve0) || !res1.eq(this.reserve1))
      this.updateReserves(res0, res1)
  }

  public getOutput(amountIn: number, direction: boolean): { output: number, gasSpent: number } {
    let inIndex = direction ? this.token0Index : this.token1Index
    const outIndex = direction ? this.token1Index : this.token0Index
    const inAmountBN = getBigNumber(amountIn)
    const normalizedBalances = this.metaSwap.xp
    const baseLPTokenIndex = normalizedBalances.length - 1

    let newInBalance = JSBI.BigInt(0)
    if (inIndex < baseLPTokenIndex) {
      newInBalance = JSBI.add(
        normalizedBalances[inIndex],
        JSBI.multiply(JSBI.BigInt(inAmountBN.toString()), this.metaSwap.tokenMultipliers[inIndex]),
      )
    }
    else {
      inIndex = inIndex - baseLPTokenIndex
      if (outIndex < baseLPTokenIndex) {
        const baseInputs = this.baseSwap.pooledTokens.map((token, index) =>
          index === inIndex
            ? Amount.fromRawAmount(token, inAmountBN.toString())
            : Amount.fromRawAmount(token, 0),
        )
        newInBalance = JSBI.divide(
          JSBI.multiply(
            JSBI.BigInt(this.baseSwap.calculateTokenAmount(baseInputs, true).quotient.toString()),
            this.baseSwap.virtualPriceRaw,
          ),
          BASE_VIRTUAL_PRICE_PRECISION,
        )
        newInBalance = JSBI.add(newInBalance, normalizedBalances[baseLPTokenIndex])
      }
      else {
        return { output: 0, gasSpent: this.swapGasCost }
      }
      inIndex = baseLPTokenIndex
    }

    let metaIndexTo = baseLPTokenIndex
    if (outIndex < baseLPTokenIndex)
      metaIndexTo = outIndex
    const outBalance = this.metaSwap._getY(inIndex, metaIndexTo, newInBalance, normalizedBalances)
    const outAmount = JSBI.subtract(normalizedBalances[metaIndexTo], outBalance)

    if (outIndex < baseLPTokenIndex) {
      const amount = JSBI.divide(outAmount, this.metaSwap.tokenMultipliers[metaIndexTo])
      const fee = JSBI.divide(JSBI.multiply(this.metaSwap.swapFee, amount), FEE_DENOMINATOR)
      return {
        output: Number.parseInt(JSBI.subtract(amount, fee).toString()),
        gasSpent: this.swapGasCost,
      }
    }
    else {
      const amount = this.baseSwap.calculateRemoveLiquidityOneToken(
        Amount.fromRawAmount(
          this.baseSwap.liquidityToken,
          JSBI.divide(JSBI.multiply(outAmount, BASE_VIRTUAL_PRICE_PRECISION), this.baseSwap.virtualPriceRaw),
        ),
        outIndex - baseLPTokenIndex,
      )[0]
      const fee = JSBI.divide(
        JSBI.multiply(this.metaSwap.swapFee, JSBI.BigInt(amount.quotient.toString())),
        FEE_DENOMINATOR,
      )
      return {
        output: Number.parseInt(JSBI.subtract(JSBI.BigInt(amount.quotient.toString()), fee).toString()),
        gasSpent: this.swapGasCost,
      }
    }
  }

  public getInput(amountOut: number, direction: boolean): { input: number, gasSpent: number } {
    const inIndex = direction ? this.token0Index : this.token1Index
    let outIndex = direction ? this.token1Index : this.token0Index
    const outAmountBN = getBigNumber(amountOut)
    const normalizedBalances = this.metaSwap.xp
    const baseLPTokenIndex = normalizedBalances.length - 1

    let newOutBalance = JSBI.BigInt(0)
    if (outIndex < baseLPTokenIndex) {
      newOutBalance = JSBI.subtract(
        normalizedBalances[outIndex],
        JSBI.multiply(JSBI.BigInt(outAmountBN.toString()), this.metaSwap.tokenMultipliers[outIndex]),
      )
    }
    else {
      outIndex = outIndex - baseLPTokenIndex
      if (inIndex < baseLPTokenIndex) {
        const baseInputs = this.baseSwap.pooledTokens.map((token, index) =>
          index === outIndex
            ? Amount.fromRawAmount(token, outAmountBN.toString())
            : Amount.fromRawAmount(token, 0),
        )
        newOutBalance = JSBI.divide(
          JSBI.multiply(
            JSBI.BigInt(this.baseSwap.calculateTokenAmount(baseInputs, true).quotient.toString()),
            this.baseSwap.virtualPriceRaw,
          ),
          BASE_VIRTUAL_PRICE_PRECISION,
        )
        newOutBalance = JSBI.subtract(normalizedBalances[baseLPTokenIndex], newOutBalance)
      }
      else {
        return { input: 0, gasSpent: this.swapGasCost }
      }
      outIndex = baseLPTokenIndex
    }

    let metaIndexFrom = baseLPTokenIndex
    if (inIndex < baseLPTokenIndex)
      metaIndexFrom = inIndex
    const inBalance = this.metaSwap._getY(outIndex, metaIndexFrom, newOutBalance, normalizedBalances)
    const inAmount = JSBI.subtract(inBalance, normalizedBalances[metaIndexFrom])

    if (inIndex < baseLPTokenIndex) {
      const amount = JSBI.divide(inAmount, this.metaSwap.tokenMultipliers[metaIndexFrom])
      const inAmountWithFee = JSBI.divide(
        amount,
        JSBI.subtract(ONE, JSBI.divide(this.metaSwap.swapFee, FEE_DENOMINATOR)),
      )
      return {
        input: Number.parseInt(inAmountWithFee.toString()),
        gasSpent: this.swapGasCost,
      }
    }
    else {
      const amount = this.baseSwap.calculateRemoveLiquidityOneToken(
        Amount.fromRawAmount(
          this.baseSwap.liquidityToken,
          JSBI.divide(JSBI.multiply(inAmount, BASE_VIRTUAL_PRICE_PRECISION), this.baseSwap.virtualPriceRaw),
        ),
        inIndex - baseLPTokenIndex,
      )[0]
      const inAmountWithFee = JSBI.divide(
        JSBI.BigInt(amount.quotient.toString()),
        JSBI.subtract(ONE, JSBI.divide(this.baseSwap.swapFee, FEE_DENOMINATOR)),
      )
      return {
        input: Number.parseInt(inAmountWithFee.toString()),
        gasSpent: this.swapGasCost,
      }
    }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const inIndex = direction ? this.token0Index : this.token1Index
    const baseLPTokenIndex = this.metaSwap.xp.length - 1
    const inToken = inIndex < baseLPTokenIndex
      ? this.metaSwap.getToken(inIndex)
      : this.baseSwap.getToken(inIndex - baseLPTokenIndex)
    return this.calcPrice(10 ** inToken.decimals, direction)
  }

  public calcPrice(amountIn: number, direction: boolean): number {
    invariant(amountIn !== 0, 'MetaPool: Invalid zero amountIn')
    const { output } = this.getOutput(amountIn, direction)
    return output / amountIn
  }
}
