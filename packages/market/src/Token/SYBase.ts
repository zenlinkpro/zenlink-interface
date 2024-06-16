import type { Amount, Currency } from '@zenlink-interface/currency'
import { Token } from '@zenlink-interface/currency'
import { type JSBI, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'

export abstract class SYBase extends Token {
  public readonly yieldToken: Token
  public readonly rewardTokens: Token[]
  public readonly tokensIn: Currency[]
  public readonly tokensOut: Currency[]
  public exchangeRate = ZERO

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    yieldToken: Token,
    rewardTokens: Token[],
    tokensIn: Currency[],
    tokensOut: Currency[],
  ) {
    super(token)
    this.yieldToken = yieldToken
    this.rewardTokens = rewardTokens
    this.tokensIn = tokensIn
    this.tokensOut = tokensOut
  }

  public updateExchangeRate(exchageRate: JSBI) {
    this.exchangeRate = exchageRate
  }

  protected abstract _previewDeposit(tokenIn: Currency, amountTokenToDeposit: Amount<Currency>): Amount<Token>

  protected abstract _previewRedeem(tokenOut: Currency, amountSharesToRedeem: Amount<Currency>): Amount<Token>

  public isValidTokenIn(token: Currency): boolean {
    return this.tokensIn.some(tokenIn => tokenIn.equals(token))
  }

  public isValidTokenOut(token: Currency): boolean {
    return this.tokensOut.some(tokenOut => tokenOut.equals(token))
  }

  public previewDeposit(tokenIn: Currency, amountTokenToDeposit: Amount<Currency>): Amount<Token> {
    invariant(this.isValidTokenIn(tokenIn), 'TOKEN')
    return this._previewDeposit(tokenIn, amountTokenToDeposit)
  }

  public previewRedeem(tokenOut: Currency, amountSharesToRedeem: Amount<Currency>): Amount<Token> {
    invariant(this.isValidTokenOut(tokenOut), 'TOKEN')
    return this._previewRedeem(tokenOut, amountSharesToRedeem)
  }

  public get accruedRewards(): Amount<Currency>[] {
    return []
  }

  public get rewardIndexesCurrent(): JSBI[] {
    return []
  }
}
