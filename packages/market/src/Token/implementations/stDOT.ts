import type { Currency, Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { SYBase } from '../SYBase'

export class StDOT extends SYBase {
  public readonly xcDOT: Token
  public readonly stDOT: Token

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    xcDOT: Token,
    stDOT: Token,
    tokensIn: Currency[],
    tokensOut: Currency[],
  ) {
    super(token, stDOT, [], tokensIn, tokensOut)
    this.xcDOT = xcDOT
    this.stDOT = stDOT
  }

  public updateExchangeRate(exchageRate: JSBI) {
    super.updateExchangeRate(exchageRate)
  }

  protected _previewDeposit(tokenIn: Currency, amountTokenToDeposit: Amount<Currency>): Amount<Token> {
    if (tokenIn.equals(this.xcDOT)) {
      const amountSharesOut = JSBI.divide(amountTokenToDeposit.quotient, this.exchangeRate)
      return Amount.fromRawAmount(this, amountSharesOut)
    }
    else {
      return Amount.fromRawAmount(this, amountTokenToDeposit.quotient)
    }
  }

  protected _previewRedeem(_tokenOut: Currency, amountSharesToRedeem: Amount<Currency>): Amount<Token> {
    return Amount.fromRawAmount(this.stDOT, amountSharesToRedeem.quotient)
  }
}
