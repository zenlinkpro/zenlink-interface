import { isAddress } from '@ethersproject/address'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { Native, Token } from '@zenlink-interface/currency'
import { filterTokens, tokenComparator, useDebounce, useSortedTokensByQuery } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import type { FC, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useToken } from 'wagmi'

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
  chainId,
  tokenMap,
  balancesMap,
  pricesMap,
  includeNative = true,
}) => {
  const tokenMapValues = useMemo(() => Object.values(tokenMap), [tokenMap])
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)
  const _includeNative
    = includeNative
    && chainId
    && (!debouncedQuery || debouncedQuery.toLowerCase().includes(Native.onChain(chainId).symbol.toLowerCase()))

  useEffect(() => {
    if (query.length > 0)
      searching.current = true
  }, [query])

  const { data: searchTokenResult, isLoading } = useToken({
    address: isAddress(debouncedQuery) && !tokenMap[debouncedQuery.toLowerCase()] ? debouncedQuery : undefined,
    chainId: chainsParachainIdToChainId[chainId ?? -1],
  })

  const searchToken = useMemo(() => {
    if (!searchTokenResult || !chainId)
      return undefined
    const { decimals, address, symbol, name } = searchTokenResult
    return new Token({ chainId, decimals, address, symbol, name })
  }, [chainId, searchTokenResult])

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(tokenMapValues, debouncedQuery)
    searching.current = false
    return filtered
  }, [tokenMapValues, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return [...filteredTokens].sort(tokenComparator(balancesMap, pricesMap))
  }, [filteredTokens, pricesMap, balancesMap])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const filteredSortedTokensWithNative = useMemo(() => {
    if (_includeNative)
      return [Native.onChain(chainId), ...filteredSortedTokens]
    return filteredSortedTokens
  }, [_includeNative, chainId, filteredSortedTokens])

  return useMemo(() => {
    return children({
      currencies: filteredSortedTokensWithNative,
      inputRef,
      query,
      onInput: setQuery,
      searching: isLoading || searching.current,
      queryToken: [searchToken],
    })
  }, [children, filteredSortedTokensWithNative, isLoading, query, searchToken])
}
