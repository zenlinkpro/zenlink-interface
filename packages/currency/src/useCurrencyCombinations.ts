import { useMemo } from 'react'

import { getCurrencyCombinations } from './getCurrencyCombinations'
import type { Token } from './Token'
import type { Type } from './Type'

export function useCurrencyCombinations(chainId?: number, currencyA?: Type, currencyB?: Type): [Token, Token][] {
  return useMemo(
    () => (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : []),
    [chainId, currencyA, currencyB],
  )
}
