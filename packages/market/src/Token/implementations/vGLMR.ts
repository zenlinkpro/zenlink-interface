import type { Currency, Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { JSBI } from '@zenlink-interface/math'
import { SYBase } from '../SYBase'

export class VGLMR extends SYBase {
  public readonly wGLMR: Token
  public readonly vGLMR: Token

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    wGLMR: Token,
    vGLMR: Token,
    tokensIn: Currency[],
    tokensOut: Currency[],
  ) {
    super(token, vGLMR, [], tokensIn, tokensOut)
    this.wGLMR = wGLMR
    this.vGLMR = vGLMR
  }

  public updateExchangeRate(exchageRate: JSBI) {
    super.updateExchangeRate(exchageRate)
  }

  protected _previewDeposit(_tokenIn: Currency, amountTokenToDeposit: Amount<Currency>): Amount<Token> {
    return Amount.fromRawAmount(this, amountTokenToDeposit.quotient)
  }

  protected _previewRedeem(_tokenOut: Currency, amountSharesToRedeem: Amount<Currency>): Amount<Token> {
    return Amount.fromRawAmount(this.vGLMR, amountSharesToRedeem.quotient)
  }
}
