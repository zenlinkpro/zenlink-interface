import type { Amount, Currency } from '@zenlink-interface/currency'
import type { JSBI, Percent } from '@zenlink-interface/math'
import { Fraction } from '@zenlink-interface/math'

const ONE = new Fraction(1, 1)

export function calculateSlippageAmount(value: Amount<Currency>, slippage: Percent): [JSBI, JSBI] {
  if (slippage.lessThan(0) || slippage.greaterThan(ONE))
    throw new Error('Unexpected slippage')
  return [value.multiply(ONE.subtract(slippage)).quotient, value.multiply(ONE.add(slippage)).quotient]
}
