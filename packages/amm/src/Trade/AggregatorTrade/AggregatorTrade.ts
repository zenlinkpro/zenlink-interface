import type { Currency } from '@zenlink-interface/currency'
import { Amount, Native, Price, Token } from '@zenlink-interface/currency'
import { Fraction, ONE, Percent, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'
import type { BaseTrade, RouteDescription } from '../BaseTrade'
import { TradeVersion } from '../TradeVersion'
import type { RouteLeg } from './types'

type WriteArgs = any[]

export class AggregatorTrade implements BaseTrade {
  public readonly chainId: number
  public readonly inputAmount: Amount<Currency>
  public readonly outputAmount: Amount<Currency>
  public readonly executionPrice: Price<Currency, Currency>
  public readonly priceImpact: Percent
  public readonly routeLegs: RouteLeg[]
  public readonly callMethod: string
  public readonly writeArgs: WriteArgs
  public readonly version = TradeVersion.AGGREGATOR

  public constructor(
    chainId: number,
    inputAmount: Amount<Currency>,
    outputAmount: Amount<Currency>,
    executionPrice: Price<Currency, Currency>,
    priceImpact: Percent,
    routeLegs: RouteLeg[],
    callMethod: string,
    writeArgs: WriteArgs,
  ) {
    this.chainId = chainId
    this.inputAmount = inputAmount
    this.outputAmount = outputAmount
    this.executionPrice = executionPrice
    this.priceImpact = priceImpact
    this.routeLegs = routeLegs
    this.callMethod = callMethod
    this.writeArgs = writeArgs
  }

  public get descriptions(): RouteDescription[] {
    return this.routeLegs.map(({
      tokenFrom,
      tokenTo,
      poolFee,
      poolType,
      absolutePortion,
      poolAddress,
    }) => ({
      input: tokenFrom.address ? new Token(tokenFrom as Token) : Native.onChain(this.chainId),
      output: tokenTo.address ? new Token(tokenTo as Token) : Native.onChain(this.chainId),
      fee: poolFee * 100,
      poolAddress,
      poolType,
      absolutePortion,
    }))
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
    routeLegs: RouteLeg[],
    callMethod: string,
    writeArgs: WriteArgs,
  ): AggregatorTrade {
    const inputAmount = Amount.fromRawAmount(fromToken, amountIn)
    const outputAmount = Amount.fromRawAmount(toToken, amountOut)

    return new AggregatorTrade(
      chainId,
      inputAmount,
      outputAmount,
      new Price(fromToken, toToken, inputAmount.quotient, outputAmount.quotient),
      new Percent(Number.parseInt((priceImpact * 10000).toString()), 10000),
      routeLegs,
      callMethod,
      writeArgs,
    )
  }
}
