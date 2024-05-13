import { Amount, Token } from '@zenlink-interface/currency'
import type { JSBI } from '@zenlink-interface/math'
import { ZERO, maximum } from '@zenlink-interface/math'
import { assetToSy, isCurrentExpired, syToAsset } from '../utils'
import type { SYBase } from './SYBase'
import type { PT } from './PT'

export class YT extends Token {
  public readonly SY: SYBase
  public readonly PT: PT
  public readonly expiry: JSBI
  public readonly rewardTokens: Token[]
  public pyIndexStored = ZERO

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    SY: SYBase,
    PT: PT,
    expiry: JSBI,
    rewardTokens?: Token[],
  ) {
    super(token)
    this.SY = SY
    this.PT = PT
    this.expiry = expiry
    this.rewardTokens = rewardTokens || []
    this.PT.initializeYT(this)
  }

  public updatePyIndexStored(pyIndexStored: JSBI) {
    this.pyIndexStored = pyIndexStored
  }

  public get pyIndexCurrent(): JSBI {
    return maximum(this.SY.exchangeRate, this.pyIndexStored)
  }

  public get isExpired(): boolean {
    return isCurrentExpired(this.expiry)
  }

  public getPYMinted(syToMints: Amount<Token>): [Amount<Token>, Amount<Token>] {
    const amountPY = syToAsset(syToMints.quotient, this.pyIndexCurrent)
    return [Amount.fromRawAmount(this.PT, amountPY), Amount.fromRawAmount(this, amountPY)]
  }

  public getPYRedeemd(amounts: [Amount<Token>, Amount<Token>]): Amount<Token> {
    const amountPYToRedeem = amounts[0].lessThan(amounts[1]) ? amounts[0] : amounts[1]
    const syToUser = assetToSy(this.pyIndexCurrent, amountPYToRedeem.quotient)
    return Amount.fromRawAmount(this.SY, syToUser)
  }
}
