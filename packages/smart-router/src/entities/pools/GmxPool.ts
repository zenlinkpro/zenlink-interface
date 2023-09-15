import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import { Token } from '@zenlink-interface/currency'
import { zeroAddress } from 'viem'
import { getBigNumber, getNumber } from '../../util'
import { BasePool, TYPICAL_MINIMAL_LIQUIDITY, TYPICAL_SWAP_GAS_COST } from './BasePool'

function adjustForDecimals(amount: number, tokenDiv: Token, tokenMul: Token): number {
  return amount * (10 ** tokenMul.decimals) / (10 ** tokenDiv.decimals)
}

const MinimalDiffUsdgAmount = BigNumber.from(1000).mul(BigNumber.from(10).pow(18))

export class GmxPool extends BasePool {
  private readonly _USDG: Token
  private readonly _token0: Token
  private readonly _token1: Token
  public readonly isStable: boolean
  public usdgAmount0: BigNumber
  public usdgAmount1: BigNumber
  public maxUsdgAmount0: BigNumber
  public maxUsdgAmount1: BigNumber
  public token0MaxPrice: BigNumber
  public token0MinPrice: BigNumber
  public token1MaxPrice: BigNumber
  public token1MinPrice: BigNumber
  public readonly swapFee: number
  public readonly stableSwapFee: number
  public readonly taxFee: number
  public readonly stableTaxFee: number

  public constructor(
    address: string,
    token0: Token,
    token1: Token,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    usdgAmount0: BigNumber,
    usdgAmount1: BigNumber,
    maxUsdgAmount0: BigNumber,
    maxUsdgAmount1: BigNumber,
    token0MaxPrice: BigNumber,
    token0MinPrice: BigNumber,
    token1MaxPrice: BigNumber,
    token1MinPrice: BigNumber,
    swapFee: number,
    stableSwapFee: number,
    taxFee: number,
    stableTaxFee: number,
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
    this.isStable = this.fee === stableSwapFee
    this._USDG = new Token({
      chainId: this.token0.chainId!,
      address: zeroAddress,
      name: 'USDG',
      symbol: 'USDG',
      decimals: 18,
    })
    this._token0 = token0
    this._token1 = token1
    this.usdgAmount0 = usdgAmount0
    this.usdgAmount1 = usdgAmount1
    this.maxUsdgAmount0 = maxUsdgAmount0
    this.maxUsdgAmount1 = maxUsdgAmount1
    this.token0MaxPrice = token0MaxPrice
    this.token0MinPrice = token0MinPrice
    this.token1MaxPrice = token1MaxPrice
    this.token1MinPrice = token1MinPrice
    this.swapFee = swapFee
    this.stableSwapFee = stableSwapFee
    this.taxFee = taxFee
    this.stableTaxFee = stableTaxFee
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

  private _checkDecreasePoolAmount(isToken0: boolean, amount: BigNumber): boolean {
    const reserve = isToken0 ? this.reserve0 : this.reserve1
    const price = isToken0 ? this.token0MinPrice : this.token1MinPrice
    let usdgAmount = getNumber(reserve) * getNumber(price) / 10 ** 30
    usdgAmount = adjustForDecimals(usdgAmount, isToken0 ? this._token0 : this._token1, this._USDG)

    if (usdgAmount < getNumber(MinimalDiffUsdgAmount))
      return false
    if (reserve.lt(amount))
      return false
    return true
  }

  private _checkIncreaseUsdgAmount(isToken0: boolean, amount: BigNumber): boolean {
    const usdgAmount = isToken0 ? this.usdgAmount0 : this.usdgAmount1
    const maxUsdgAmount = isToken0 ? this.maxUsdgAmount0 : this.maxUsdgAmount1
    if (!maxUsdgAmount.eq(0)) {
      if (maxUsdgAmount.sub(usdgAmount).lt(MinimalDiffUsdgAmount))
        return false
      if (usdgAmount.add(amount).gt(maxUsdgAmount))
        return false
    }

    return true
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    const priceIn = direction ? this.token0MinPrice : this.token1MinPrice
    const priceOut = direction ? this.token1MaxPrice : this.token0MaxPrice
    const amountOut = amountIn * getNumber(priceIn) / getNumber(priceOut)
    const amountOutAfterAdjustDecimals = adjustForDecimals(
      amountOut,
      direction ? this._token0 : this._token1,
      direction ? this._token1 : this._token0,
    )
    const reserveOut = direction ? getNumber(this.reserve1) : getNumber(this.reserve0)
    let usdgAmount = amountIn * getNumber(priceIn) / 10 ** 30
    usdgAmount = adjustForDecimals(usdgAmount, direction ? this._token0 : this._token1, this._USDG)

    if (
      !this._checkIncreaseUsdgAmount(direction, getBigNumber(usdgAmount))
      || !this._checkDecreasePoolAmount(!direction, getBigNumber(amountOutAfterAdjustDecimals))
    )
      return { output: 0, gasSpent: this.swapGasCost }

    const taxFee = amountOutAfterAdjustDecimals * (this.isStable ? this.stableTaxFee : this.taxFee) / reserveOut

    return { output: amountOutAfterAdjustDecimals * (1 - this.fee - taxFee), gasSpent: this.swapGasCost }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    const priceIn = direction ? this.token0MinPrice : this.token1MinPrice
    const priceOut = direction ? this.token1MaxPrice : this.token0MaxPrice

    const reserveOut = direction ? getNumber(this.reserve1) : getNumber(this.reserve0)
    if (!this._checkDecreasePoolAmount(!direction, getBigNumber(amountOut)))
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    const taxFee = amountOut * (this.isStable ? this.stableTaxFee : this.taxFee) / reserveOut
    const amountOutBeforeFee = amountOut / (1 - this.fee - taxFee)
    const amountIn = amountOutBeforeFee * getNumber(priceOut) / getNumber(priceIn)
    const amountInAfterAdjustDecimals = adjustForDecimals(
      amountIn,
      direction ? this._token1 : this._token0,
      direction ? this._token0 : this._token1,
    )
    let usdgAmount = amountInAfterAdjustDecimals * getNumber(priceIn) / 10 ** 30
    usdgAmount = adjustForDecimals(usdgAmount, direction ? this._token0 : this._token1, this._USDG)
    if (!this._checkIncreaseUsdgAmount(direction, getBigNumber(usdgAmount)))
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    return { input: amountInAfterAdjustDecimals, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const priceIn = direction ? this.token0MinPrice : this.token1MinPrice
    const priceOut = direction ? this.token1MaxPrice : this.token0MaxPrice
    const price = adjustForDecimals(
      getNumber(priceIn) / getNumber(priceOut),
      direction ? this._token0 : this._token1,
      direction ? this._token1 : this._token0,
    )

    return price
  }
}
