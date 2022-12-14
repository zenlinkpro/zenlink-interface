import type { Type } from '@zenlink-interface/currency'

export function isNativeCurrency(currency: Type): boolean {
  // BNC
  return currency.wrapped.address === '2001-0-0'
}
