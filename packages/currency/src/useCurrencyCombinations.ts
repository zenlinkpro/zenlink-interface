import type { Token } from './Token'

import type { Type } from './Type'
import { useMemo } from 'react'
import { getCurrencyCombinations } from './getCurrencyCombinations'

export function useCurrencyCombinations(chainId?: number, currencyA?: Type, currencyB?: Type): [Token, Token][] {
  return useMemo(
    () => (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : []),
    [chainId, currencyA, currencyB],
  )
}
