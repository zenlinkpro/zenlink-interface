import type { Currency, Token } from '@zenlink-interface/currency'
import { Amount, Price } from '@zenlink-interface/currency'
import type { JSBI, Percent } from '@zenlink-interface/math'
import { Fraction, ONE, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'
import type { Market } from '../Market'
import { TradeType } from './TradeType'

export class Trade {
  public readonly chainId: number
  public readonly inputAmount: Amount<Currency>
  public readonly outputAmount: Amount<Currency>
  public readonly executionPrice: Price<Currency, Currency>
  public readonly tradeType: TradeType
  public readonly guessOffChain: JSBI | undefined

  public constructor(
    chainId: number,
    inputAmount: Amount<Currency>,
    outputAmount: Amount<Currency>,
    tradeType: TradeType,
    guessOffChain: JSBI | undefined,
  ) {
    this.chainId = chainId
    this.inputAmount = inputAmount
    this.outputAmount = outputAmount
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient,
    )
    this.tradeType = tradeType
    this.guessOffChain = guessOffChain
  }

  public minimumAmountOut(slippageTolerance: Percent): Amount<Token> {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')

    const slippageAdjustedAmountOut = new Fraction(ONE)
      .add(slippageTolerance)
      .invert()
      .multiply(this.outputAmount.quotient).quotient

    return Amount.fromRawAmount(this.outputAmount.currency.wrapped, slippageAdjustedAmountOut)
  }

  public static bestTradeExactIn(
    market: Market,
    currencyAmountIn: Amount<Currency>,
    currencyOut: Currency,
  ): Trade | undefined {
    let amountOut: Amount<Token> | undefined
    let tradeType: TradeType | undefined
    let guess: JSBI | undefined

    try {
      if (market.isYieldToken(currencyAmountIn.currency.wrapped)) {
        const syAmountIn = market.SY.previewDeposit(currencyAmountIn.currency, currencyAmountIn)
        // SwapExactSyForPt
        if (market.isPT(currencyOut.wrapped)) {
          tradeType = TradeType.EXACT_TOKEN_FOR_PT
          ;[amountOut, guess] = market.getSwapExactSyForPt(syAmountIn)
        }
        // SwapExactSyForYt
        else if (market.isYT(currencyOut.wrapped)) {
          tradeType = TradeType.EXACT_TOKEN_FOR_YT
          ;[amountOut, guess] = market.getSwapExactSyForYt(syAmountIn)
        }
      }
      else if (market.isPT(currencyAmountIn.currency.wrapped)) {
        // SwapExactPtForYt
        if (market.isYT(currencyOut.wrapped)) {
          tradeType = TradeType.EXACT_PT_FOR_YT
          ;[amountOut, guess] = market.getSwapExactPtForYt(currencyAmountIn.wrapped)
        }
        // SwapExactPtForSy
        else if (market.isYieldToken(currencyOut.wrapped)) {
          tradeType = TradeType.EXACT_PT_FOR_TOKEN
          const syAmountOut = market.getSwapExactPtForSy(currencyAmountIn.wrapped)
          amountOut = market.SY.previewRedeem(currencyOut, syAmountOut)
        }
      }
      else if (market.isYT(currencyAmountIn.currency.wrapped)) {
        // SwapExactYtForPt
        if (market.isPT(currencyOut.wrapped)) {
          tradeType = TradeType.EXACT_YT_FOR_PT
          ;[amountOut, guess] = market.getSwapExactYtForPt(currencyAmountIn.wrapped)
        }
        // SwapExactYtForSy
        else if (market.isYieldToken(currencyOut.wrapped)) {
          tradeType = TradeType.EXACT_YT_FOR_TOKEN
          const syAmountOut = market.getSwapExactYtForSy(currencyAmountIn.wrapped)
          amountOut = market.SY.previewRedeem(currencyOut, syAmountOut)
        }
      }

      if (amountOut?.greaterThan(ZERO) && tradeType !== undefined)
        return new Trade(market.chainId, currencyAmountIn, amountOut, tradeType, guess)
      else
        return undefined
    }
    catch (err) {
      console.error(err)
      return undefined
    }
  }
}
