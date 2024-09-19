import type BigintIsh from './BigintIsh'

import type Rounding from './Rounding'
import JSBI from 'jsbi'
import Fraction from './Fraction'

const ONE_HUNDRED = new Fraction(JSBI.BigInt(100))

/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction: Fraction): Percent {
  return new Percent(fraction.numerator, fraction.denominator)
}

class Percent extends Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  public readonly isPercent = true as const

  add(other: Fraction | BigintIsh): Percent {
    return toPercent(super.add(other))
  }

  subtract(other: Fraction | BigintIsh): Percent {
    return toPercent(super.subtract(other))
  }

  multiply(other: Fraction | BigintIsh): Percent {
    return toPercent(super.multiply(other))
  }

  divide(other: Fraction | BigintIsh): Percent {
    return toPercent(super.divide(other))
  }

  public toSignificant(significantDigits = 5, format?: object, rounding?: Rounding): string {
    return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces = 2, format?: object, rounding?: Rounding): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding)
  }
}

export default Percent
