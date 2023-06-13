import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { filterTokens, tokenComparator, useDebounce, useSortedTokensByQuery } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import type { FC, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { BalanceMap } from '../../hooks/useBalance/types'

interface RenderProps {
  currencies: Type[]
  inputRef: RefObject<HTMLInputElement>
  query: string
  onInput(query: string): void
  searching: boolean
  queryToken: [Token | undefined]
}

interface Props {
  chainId?: ParachainId
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction>
  balancesMap?: BalanceMap
  children(props: RenderProps): JSX.Element
  includeNative?: boolean
}

export const TokenListFilterByQuery: FC<Props> = ({
  children,
  tokenMap,
  balancesMap,
  pricesMap,
}) => {
  const tokenMapValues = useMemo(() => Object.values(tokenMap), [tokenMap])
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)

  useEffect(() => {
    if (query.length > 0)
      searching.current = true
  }, [query])

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(tokenMapValues, debouncedQuery)
    searching.current = false
    return filtered
  }, [tokenMapValues, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return [...filteredTokens].sort(tokenComparator(balancesMap, pricesMap))
  }, [filteredTokens, pricesMap, balancesMap])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  return useMemo(() => {
    return children({
      currencies: filteredSortedTokens,
      inputRef,
      query,
      onInput: setQuery,
      searching: searching.current,
      queryToken: [undefined],
    })
  }, [children, filteredSortedTokens, query])
}
