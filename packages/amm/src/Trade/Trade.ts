import type { Token } from '@zenlink-interface/currency'
import { Amount, Price } from '@zenlink-interface/currency'
import type { Percent } from '@zenlink-interface/math'
import { Fraction, ONE, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'
import type { MultiPath } from '../MultiRoute'
import { MultiRoute } from '../MultiRoute'
import type { Pool } from '../Pool'
import type { StableSwap } from '../StablePool'
import { getStableSwapOutputAmount } from '../StablePool'
import { computePriceImpact } from './computePriceImpact'
import { convertStableSwapOrPairToPool } from './convertStableSwapOrPairToPool'
import { sortedInsert } from './sortedInsert'
import { tradeComparator } from './tradeComparator'

export interface BestTradeOptions {
  maxNumResults?: number
  maxHops?: number
}

export class Trade {
  public readonly chainId: number
  public readonly route: MultiRoute
  public readonly inputAmount: Amount<Token>
  public readonly outputAmount: Amount<Token>
  public readonly executionPrice: Price<Token, Token>
  public readonly priceImpact: Percent

  public constructor(
    chainId: number,
    route: MultiRoute,
    amount: Amount<Token>,
  ) {
    const amounts: Amount<Token>[] = new Array(route.tokenPath.length)

    invariant(amount.currency.equals(route.input), 'INPUT')
    amounts[0] = amount

    for (let i = 0; i < route.tokenPath.length - 1; i++) {
      const currentPath = route.routePath[i]
      let outputAmount: Amount<Token>

      if (currentPath.stable) {
        outputAmount = getStableSwapOutputAmount(currentPath, amounts[i])
      }
      else {
        invariant(typeof currentPath.pair !== 'undefined', 'PAIR');
        [outputAmount] = currentPath.pair.getOutputAmount(amounts[i])
      }

      amounts[i + 1] = outputAmount
    }

    this.chainId = chainId
    this.route = route
    this.inputAmount = amount
    this.outputAmount = amounts[amounts.length - 1]
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient,
    )
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }

  public minimumAmountOut(slippageTolerance: Percent): Amount<Token> {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')

    const slippageAdjustedAmountOut = new Fraction(ONE)
      .add(slippageTolerance)
      .invert()
      .multiply(this.outputAmount.quotient).quotient

    return Amount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut)
  }

  public static bestTradeExactIn(
    chainId: number,
    pairs: Pool[],
    stableSwaps: StableSwap[],
    currencyAmountIn: Amount<Token>,
    currencyOut: Token,
    { maxHops = 3, maxNumResults = 3 }: BestTradeOptions = {},
    currentPaths: MultiPath[] = [],
    originalAmountIn: Amount<Token> = currencyAmountIn,
    bestTrades: Trade[] = [],
  ): Trade[] {
    invariant(pairs.length > 0 || stableSwaps.length > 0, 'PAIRS_OR_STABLESWAPS')
    invariant(maxHops > 0, 'MAX_HOPS')
    invariant(originalAmountIn === currencyAmountIn || currentPaths.length > 0, 'INVALID_RECURSION')

    const amountIn = currencyAmountIn
    const tokenOut = currencyOut

    if (stableSwaps.length) {
      pairs = convertStableSwapOrPairToPool(pairs, stableSwaps)
      stableSwaps = []
    }

    for (let i = 0; i < pairs.length; i++) {
      let amountOut: Amount<Token>
      const pair = pairs[i]

      if (!pair.token0.equals(amountIn.currency) && !pair.token1.equals(amountIn.currency))
        continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO))
        continue

      try {
        [amountOut] = pair.getOutputAmount(amountIn)
      }
      catch (error: any) {
        if (error.isInsufficientInputAmountError || error.isCalculationError)
          continue
        throw error
      }

      if (amountOut.currency.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new Trade(
            chainId,
            new MultiRoute(chainId, [...currentPaths, pair.pathOf(amountIn.currency)], originalAmountIn, currencyOut),
            originalAmountIn,
          ),
          maxNumResults,
          tradeComparator,
        )
      }
      else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))

        Trade.bestTradeExactIn(
          chainId,
          pairsExcludingThisPair,
          stableSwaps,
          amountOut,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1,
          },
          [...currentPaths, pair.pathOf(amountIn.currency)],
          originalAmountIn,
          bestTrades,
        )
      }
    }

    return bestTrades
  }
}
