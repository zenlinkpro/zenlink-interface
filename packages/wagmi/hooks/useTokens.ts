import type { QueryFunction } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Address } from 'wagmi'
import { useQuery } from 'wagmi'
import type { FetchTokenArgs, FetchTokenResult } from 'wagmi/actions'
import { fetchToken } from 'wagmi/actions'

export interface FetchTokensArgs { tokens: FetchTokenArgs[] }
export type UseTokensArgs = Partial<FetchTokensArgs>
export type FetchTokensResult = FetchTokenResult[]
export type UseTokensConfig = Partial<Parameters<typeof useQuery>['2']>

interface QueryKeyArgs { tokens: Partial<FetchTokenArgs>[] }

function queryKey({ tokens }: QueryKeyArgs) {
  return [{ entity: 'tokens', tokens: tokens || [] }] as const
}

const queryFn: QueryFunction<FetchTokensResult, ReturnType<typeof queryKey>> = ({ queryKey: [{ tokens }] }) => {
  if (!tokens)
    throw new Error('tokens is required')
  if (tokens.filter(el => !el.address).length > 0)
    throw new Error('address is required')

  return Promise.all(
    tokens.map(token =>
      fetchToken({ address: token.address as Address, chainId: token.chainId, formatUnits: token.formatUnits }),
    ),
  )
}

export function useTokens({
  tokens = [],
  cacheTime,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseTokensArgs & UseTokensConfig): { data: {
    address: string
    name: string
    symbol: string
    decimals: number
  }[] | undefined } {
  const _enabled = useMemo(() => {
    return Boolean(tokens && tokens?.length > 0 && enabled && tokens.map(el => el.address && el.chainId))
  }, [enabled, tokens])

  return useQuery<FetchTokensResult, unknown, FetchTokensResult, ReturnType<typeof queryKey>>(
    queryKey({ tokens }),
    queryFn,
    {
      cacheTime,
      enabled: _enabled,
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    })
}
