import { Amount, Price, Token } from '@zenlink-interface/currency'
import type { BigintIsh } from '@zenlink-interface/math'
import { FIVE, JSBI, ONE, ZERO, _1000, _997, sqrt } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'

import { ParachainId } from '@zenlink-interface/chain'
import { InsufficientInputAmountError, InsufficientReservesError } from '../errors'
import { Fee } from '../Fee'
import type { MultiPath } from '../MultiRoute'
import { computePairAddress } from './computePairAddress'
import { FACTORY_ADDRESS } from './constants'

export class Pair {
  public readonly liquidityToken: Token
  public readonly swapGasCost = JSBI.BigInt(60000)
  public readonly minLiquidity = JSBI.BigInt(1000)
  public readonly fee = Fee.DEFAULT
  private readonly tokenAmounts: [Amount<Token>, Amount<Token>]
  private readonly pairAddress: string

  public static getAddress(tokenA: Token, tokenB: Token): string {
    return computePairAddress({
      factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
      tokenA,
      tokenB,
    })
  }

  public constructor(AmountA: Amount<Token>, AmountB: Amount<Token>, PairAddress?: string) {
    const Amounts = AmountA.currency.sortsBefore(AmountB.currency) // does safety checks
      ? [AmountA, AmountB]
      : [AmountB, AmountA]

    const chainId = Amounts[0].currency.chainId
    this.liquidityToken = new Token({
      chainId,
      address: this.pairAddress = PairAddress || Pair.getAddress(Amounts[0].currency, Amounts[1].currency),
      decimals: (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM) ? 12 : 18,
      symbol: 'ZLK-LP',
      name: 'Zenlink LP Token',
    })
    this.tokenAmounts = Amounts as [Amount<Token>, Amount<Token>]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<Token, Token> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new Price(this.token0, this.token1, result.denominator, result.numerator)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Token, Token> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(this.token1, this.token0, result.denominator, result.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].currency
  }

  public get token1(): Token {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): Amount<Token> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): Amount<Token> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Token): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public pathOf(token: Token): MultiPath {
    invariant(this.involvesToken(token), 'TOKEN')

    return {
      stable: false,
      input: token,
      output: token.equals(this.token0) ? this.token1 : this.token0,
      pair: this,
    }
  }

  public getOutputAmount(inputAmount: Amount<Token>): [Amount<Token>, Pair] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO))
      throw new InsufficientReservesError()

    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.quotient, _997)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _1000), inputAmountWithFee)
    const outputAmount = Amount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator),
    )
    if (JSBI.equal(outputAmount.quotient, ZERO))
      throw new InsufficientInputAmountError()

    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.pairAddress)]
  }

  public getInputAmount(outputAmount: Amount<Token>): [Amount<Token>, Pair] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.quotient, ZERO)
      || JSBI.equal(this.reserve1.quotient, ZERO)
      || JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)
    )
      throw new InsufficientReservesError()

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), _1000)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmount.quotient), _997)
    const inputAmount = Amount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE),
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.pairAddress)]
  }

  public getLiquidityMinted(
    totalSupply: Amount<Token>,
    tokenAmountA: Amount<Token>,
    tokenAmountB: Amount<Token>,
  ): Amount<Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)),
        this.minLiquidity,
      )
    }
    else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO))
      throw new InsufficientInputAmountError()

    return Amount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: Amount<Token>,
    liquidity: Amount<Token>,
    feeOn = false,
    kLast?: BigintIsh,
  ): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient), 'LIQUIDITY')

    let totalSupplyAdjusted: Amount<Token>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    }
    else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = JSBI.BigInt(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.quotient, this.reserve1.quotient))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.quotient, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(Amount.fromRawAmount(this.liquidityToken, feeLiquidity))
        }
        else {
          totalSupplyAdjusted = totalSupply
        }
      }
      else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return Amount.fromRawAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupplyAdjusted.quotient),
    )
  }
}
