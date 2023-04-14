import type { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import type { Token } from '@zenlink-interface/currency'
import { BasePool, TYPICAL_MINIMAL_LIQUIDITY, TYPICAL_SWAP_GAS_COST } from './BasePool'

function adjustForDecimals(amount: number, tokenDiv: Token, tokenMul: Token): number {
  return amount * (10 ** tokenMul.decimals) / (10 ** tokenDiv.decimals)
}

export class GmxPool extends BasePool {
  private readonly _token0: Token
  private readonly _token1: Token
  public token0MaxPrice: BigNumber
  public token0MinPrice: BigNumber
  public token1MaxPrice: BigNumber
  public token1MinPrice: BigNumber

  public constructor(
    address: string,
    token0: Token,
    token1: Token,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    token0MaxPrice: BigNumber,
    token0MinPrice: BigNumber,
    token1MaxPrice: BigNumber,
    token1MinPrice: BigNumber,
  ) {
    super(
      address,
      token0 as BaseToken,
      token1 as BaseToken,
      fee,
      reserve0,
      reserve1,
      TYPICAL_MINIMAL_LIQUIDITY,
      TYPICAL_SWAP_GAS_COST,
    )
    this._token0 = token0
    this._token1 = token1
    this.token0MaxPrice = token0MaxPrice
    this.token0MinPrice = token0MinPrice
    this.token1MaxPrice = token1MaxPrice
    this.token1MinPrice = token1MinPrice
  }

  public updateState(
    reserve0: BigNumber,
    reserve1: BigNumber,
    token0MaxPrice: BigNumber,
    token0MinPrice: BigNumber,
    token1MaxPrice: BigNumber,
    token1MinPrice: BigNumber,
  ) {
    this.updateReserves(reserve0, reserve1)
    this.token0MaxPrice = token0MaxPrice
    this.token0MinPrice = token0MinPrice
    this.token1MaxPrice = token1MaxPrice
    this.token1MinPrice = token1MinPrice
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    const priceIn = direction ? this.token0MinPrice : this.token1MinPrice
    const priceOut = direction ? this.token1MaxPrice : this.token0MaxPrice
    const amountOut = amountIn * parseInt(priceIn.toString()) / parseInt(priceOut.toString())

    const reserveOut = direction ? this.reserve1 : this.reserve0
    if (amountOut >= parseInt(reserveOut.toString()))
      return { output: 0, gasSpent: this.swapGasCost }

    const amountOutAfterAdjustDecimals = adjustForDecimals(
      amountOut,
      direction ? this._token0 : this._token1,
      direction ? this._token1 : this._token0,
    )
    return { output: amountOutAfterAdjustDecimals * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    const priceIn = direction ? this.token0MinPrice : this.token1MinPrice
    const priceOut = direction ? this.token1MaxPrice : this.token0MaxPrice

    const reserveOut = direction ? this.reserve1 : this.reserve0
    if (amountOut >= parseInt(reserveOut.toString()))
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    const amountOutBeforeFee = amountOut / (1 - this.fee)
    const amountIn = amountOutBeforeFee * parseInt(priceOut.toString()) / parseInt(priceIn.toString())
    const amountInAfterAdjustDecimals = adjustForDecimals(
      amountIn,
      direction ? this._token1 : this._token0,
      direction ? this._token0 : this._token1,
    )
    return { input: amountInAfterAdjustDecimals, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const priceIn = direction ? this.token0MinPrice : this.token1MinPrice
    const priceOut = direction ? this.token1MaxPrice : this.token0MaxPrice
    return adjustForDecimals(
      parseInt(priceIn.toString()) / parseInt(priceOut.toString()),
      direction ? this._token0 : this._token1,
      direction ? this._token1 : this._token0,
    )
  }
}
