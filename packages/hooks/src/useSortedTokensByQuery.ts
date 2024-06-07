import type { Amount, Token, Type } from '@zenlink-interface/currency'
import { isAddress } from '@zenlink-interface/format'
import type { Fraction } from '@zenlink-interface/math'
import { useMemo } from 'react'

const alwaysTrue = () => true

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends Token>(search: string): (tokens: T) => boolean {
  const validAddress = isAddress(search)

  if (validAddress) {
    const lower = search.toLowerCase()
    return (t: T) => lower === t.address.toLowerCase()
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0)
    return alwaysTrue

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ name, symbol }: T): boolean => Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
}

export function filterTokens<T extends Token>(tokens: T[], search: string): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export function balanceComparator(balanceA?: Amount<Type>, balanceB?: Amount<Type>) {
  if (balanceA && balanceB) {
    if (balanceA.asFraction.equalTo(balanceB.asFraction))
      return 0
    return balanceA.asFraction.greaterThan(balanceB.asFraction) ? -1 : 1
  }
  else if (balanceA && balanceA.greaterThan('0')) {
    return -1
  }
  else if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

export function tokenComparator(balancesMap: Record<string, Amount<Type> | undefined> | undefined, pricesMap: Record<string, Fraction> | undefined) {
  return (tokenA: Token, tokenB: Token): number => {
    const balanceA = balancesMap?.[tokenA.address]
    const balanceB = balancesMap?.[tokenB.address]
    const priceA = pricesMap?.[tokenA.address]
      ? balanceA?.multiply(pricesMap[tokenA.address])
      : undefined
    const priceB = pricesMap?.[tokenB.address]
      ? balanceB?.multiply(pricesMap[tokenB.address])
      : undefined

    const balanceComp = balanceComparator(priceA, priceB)
    if (balanceComp !== 0)
      return balanceComp

    if (balanceA && balanceB) {
      return balanceA.greaterThan(balanceB) ? -1 : 1
    }
    else if (balanceA) {
      return -1
    }
    else if (balanceB) {
      return 1
    }
    else {
      if (tokenA.symbol && tokenB.symbol) {
        // sort by symbol
        return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
      }
      else {
        return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
      }
    }
  }
}

export function useSortedTokensByQuery(tokens: Token[] | undefined, searchQuery: string): Token[] {
  return useMemo(() => {
    if (!tokens)
      return []

    if (searchQuery === '')
      return tokens

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    if (symbolMatch.length > 1)
      return tokens

    const exactMatches: Token[] = []
    const symbolSubstrings: Token[] = []
    const rest: Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0])
        return exactMatches.push(token)

      else if (token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim()))
        return symbolSubstrings.push(token)

      else
        return rest.push(token)
    })

    return [...exactMatches, ...symbolSubstrings, ...rest]
  }, [tokens, searchQuery])
}
