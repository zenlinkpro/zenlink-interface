import type { Type } from './Type'
import { parseUnits } from '@ethersproject/units'

import { JSBI } from '@zenlink-interface/math'
import { Amount } from './Amount'

// try to parse a user entered amount for a given token
export function tryParseAmount<T extends Type>(value?: string, currency?: T): Amount<T> | undefined {
  if (!value || !currency)
    return undefined

  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0')
      return Amount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed))
  }
  catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    // eslint-disable-next-line no-console
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}
