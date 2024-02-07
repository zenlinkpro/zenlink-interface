import type { Token, Type } from '@zenlink-interface/currency'
import { filterTokens, useDebounce, useSortedTokensByQuery } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import type { FC, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface RenderProps {
  currencies: Type[]
  inputRef: RefObject<HTMLInputElement>
  query: string
  onInput: (query: string) => void
  searching: boolean
  queryToken: [Token | undefined]
}

interface Props {
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction>
  children: (props: RenderProps) => JSX.Element
  includeNative?: boolean
}

export const TokenListFilterByQuery: FC<Props> = ({ children, tokenMap }) => {
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

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  return useMemo(() => {
    return children({
      currencies: filteredSortedTokens,
      inputRef,
      onInput: setQuery,
      query,
      queryToken: [undefined],
      searching: searching.current,
    })
  }, [children, filteredSortedTokens, query])
}
