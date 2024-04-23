import { Amount, Token } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { assetToSY, syToAsset } from '../utils'
import type { SYBase } from './SYBase'

export class YT extends Token {
  public readonly SY: SYBase
  public readonly PT: Token
  public readonly expiry: number
  public readonly pyIndexStored: JSBI

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    SY: SYBase,
    PT: Token,
    expiry: number,
    pyIndexStored: JSBI,
  ) {
    super(token)
    this.SY = SY
    this.PT = PT
    this.expiry = expiry
    this.pyIndexStored = pyIndexStored
  }

  public get pyIndexCurrent(): JSBI {
    return JSBI.GT(this.SY.exchangeRate, this.pyIndexStored) ? this.SY.exchangeRate : this.pyIndexStored
  }

  public getPYMinted(syToMints: Amount<Token>): [Amount<Token>, Amount<Token>] {
    const amountPY = syToAsset(syToMints.quotient, this.pyIndexCurrent)
    return [Amount.fromRawAmount(this.PT, amountPY), Amount.fromRawAmount(this, amountPY)]
  }

  public getPYRedeemd(amounts: [Amount<Token>, Amount<Token>]): Amount<Token> {
    const amountPYToRedeem = amounts[0].lessThan(amounts[1]) ? amounts[0] : amounts[1]
    const syToUser = assetToSY(this.pyIndexCurrent, amountPYToRedeem.quotient)
    return Amount.fromRawAmount(this.SY, syToUser)
  }
}
