import type { BigintIsh } from '@zenlink-interface/math'
import { Big, Fraction, JSBI, MAX_UINT128, Rounding, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'

import { Amount } from './Amount'
import type { Type } from './Type'

export class Share<T extends Type> extends Fraction {
  public readonly currency: T
  public readonly scale: JSBI

  public static fromRawShare<T extends Type>(currency: T, rawShare: BigintIsh): Share<T> {
    return new Share(currency, rawShare)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(JSBI.lessThanOrEqual(this.quotient, MAX_UINT128), 'SHARE')
    this.currency = currency
    this.scale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
  }

  public toAmount(rebase: { base: JSBI, elastic: JSBI }, roundUp = false) {
    if (JSBI.EQ(rebase.base, ZERO))
      return Amount.fromRawAmount(this.currency, this.quotient)

    const elastic = JSBI.divide(JSBI.multiply(this.quotient, rebase.elastic), rebase.base)

    if (roundUp && JSBI.LT(JSBI.divide(JSBI.multiply(elastic, rebase.base), rebase.elastic), this.quotient))
      return Amount.fromRawAmount(this.currency, JSBI.add(elastic, JSBI.BigInt(1)))

    return Amount.fromRawAmount(this.currency, elastic)
  }

  /**
   * Construct a currency share with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token share
   * @param denominator the denominator of the fractional token share
   */
  public static fromFractionalShare<T extends Type>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh,
  ): Share<T> {
    return new Share(currency, numerator, denominator)
  }

  public add(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return Share.fromFractionalShare(this.currency, added.numerator, added.denominator)
  }

  public subtract(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return Share.fromFractionalShare(this.currency, subtracted.numerator, subtracted.denominator)
  }

  public multiply(other: Fraction | BigintIsh): Share<T> {
    const multiplied = super.multiply(other)
    return Share.fromFractionalShare(this.currency, multiplied.numerator, multiplied.denominator)
  }

  public divide(other: Fraction | BigintIsh): Share<T> {
    const divided = super.divide(other)
    return Share.fromFractionalShare(this.currency, divided.numerator, divided.denominator)
  }

  public toSignificant(significantDigits = 6, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
    return super.divide(this.scale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString()).div(this.scale.toString()).toFormat(format)
  }
}
