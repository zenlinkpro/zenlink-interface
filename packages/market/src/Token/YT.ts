import { Amount, Token } from '@zenlink-interface/currency'
import { JSBI, ZERO, maximum } from '@zenlink-interface/math'
import { assetToSy, divDown, isCurrentExpired, mulDown, syToAsset } from '../utils'
import type { SYBase } from './SYBase'
import type { PT } from './PT'

export class YT extends Token {
  public readonly SY: SYBase
  public readonly PT: PT
  public readonly expiry: JSBI
  public readonly rewardTokens: Token[]
  public pyIndexStored = ZERO
  public globalInterestIndex = ZERO
  public totalSupply = ZERO
  private readonly interestFeeRate = JSBI.BigInt(3e16)

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

  public updateState(pyIndexStored: JSBI, globalInterestIndex: JSBI, totalSupply: JSBI) {
    this.pyIndexStored = pyIndexStored
    this.globalInterestIndex = globalInterestIndex
    this.totalSupply = totalSupply
  }

  public calcPendingInterestOfUser(userBalance: JSBI, userIndex: JSBI): JSBI {
    if (JSBI.equal(userIndex, ZERO))
      return ZERO

    const prevIndex = this.pyIndexStored
    const currentIndex = this.pyIndexCurrent

    let accruedAmount = ZERO
    if (!JSBI.equal(prevIndex, currentIndex)) {
      const totalInterest = this._calcInterest(this.totalSupply, prevIndex, currentIndex)
      const feeAmount = mulDown(totalInterest, this.interestFeeRate)
      accruedAmount = JSBI.subtract(totalInterest, feeAmount)
    }

    let index = this.globalInterestIndex
    if (JSBI.greaterThan(this.totalSupply, ZERO))
      index = JSBI.add(index, divDown(accruedAmount, this.totalSupply))

    if (JSBI.equal(userIndex, index) || JSBI.equal(userIndex, ZERO))
      return ZERO

    return mulDown(userBalance, JSBI.subtract(index, userIndex))
  }

  public get pyIndexCurrent(): JSBI {
    return maximum(this.SY.exchangeRate, this.pyIndexStored)
  }

  public get isExpired(): boolean {
    return isCurrentExpired(this.expiry)
  }

  private _calcInterest(principal: JSBI, prevIndex: JSBI, currentIndex: JSBI): JSBI {
    return divDown(
      JSBI.multiply(principal, JSBI.subtract(currentIndex, prevIndex)),
      JSBI.multiply(prevIndex, currentIndex),
    )
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
