import type { Currency, Token } from '@zenlink-interface/currency'
import { Amount, Price } from '@zenlink-interface/currency'
import { Fraction, ONE, Percent, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'
import type { BaseTrade, RouteDescription } from '../BaseTrade'
import { TradeVersion } from '../TradeVersion'

export class SplitTrade implements BaseTrade {
  public readonly chainId: number
  public readonly inputAmount: Amount<Currency>
  public readonly outputAmount: Amount<Currency>
  public readonly executionPrice: Price<Currency, Currency>
  public readonly priceImpact: Percent
  public readonly version = TradeVersion.SPLIT_V1

  public constructor(
    chainId: number,
    inputAmount: Amount<Currency>,
    outputAmount: Amount<Currency>,
    executionPrice: Price<Currency, Currency>,
    priceImpact: Percent,
  ) {
    this.chainId = chainId
    this.inputAmount = inputAmount
    this.outputAmount = outputAmount
    this.executionPrice = executionPrice
    this.priceImpact = priceImpact
  }

  public get descriptions(): RouteDescription[] {
    return []
  }

  public minimumAmountOut(slippageTolerance: Percent): Amount<Token> {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')

    const slippageAdjustedAmountOut = new Fraction(ONE)
      .add(slippageTolerance)
      .invert()
      .multiply(this.outputAmount.quotient).quotient

    return Amount.fromRawAmount(this.outputAmount.currency.wrapped, slippageAdjustedAmountOut)
  }

  public static bestTradeFromAPIRoute(
    chainId: number,
    fromToken: Currency,
    toToken: Currency,
    amountIn: string,
    amountOut: string,
    priceImpact: number,
  ): SplitTrade {
    const inputAmount = Amount.fromRawAmount(fromToken, amountIn)
    const outputAmount = Amount.fromRawAmount(toToken, amountOut)
    const priceImpactPercent = new Percent(parseInt((priceImpact * 10000).toString()), 10000)
    const executionPrice = new Price(fromToken, toToken, inputAmount.quotient, outputAmount.quotient)

    return new SplitTrade(
      chainId,
      inputAmount,
      outputAmount,
      executionPrice,
      priceImpactPercent,
    )
  }
}
