import { useMemo } from 'react'
import type { Address } from 'wagmi'
import { useQuery } from 'wagmi'
import type { FetchTokenArgs } from 'wagmi/actions'
import { fetchToken } from 'wagmi/actions'

export interface FetchTokensArgs { tokens: FetchTokenArgs[] }
export type UseTokensArgs = Partial<FetchTokensArgs>

export const queryKey = ({ tokens }: Partial<FetchTokensArgs>) => {
  return (
    tokens?.length
      ? tokens.map(token => ({
        entity: 'token',
        address: token.address,
        chainId: token.chainId,
        formatUnits: token.formatUnits,
      }))
      : [{ entity: 'token', address: '0x' as Address, chainId: undefined, formatUnits: undefined }]
  )
}

const queryFn = ({ queryKey: tokens }: { queryKey: FetchTokenArgs[] }) => {
  if (tokens.filter(el => !el.address).length > 0)
    throw new Error('address is required')

  return Promise.all(
    tokens.map((token) => {
      return fetchToken({
        address: token.address,
        chainId: token.chainId,
        formatUnits: token.formatUnits,
      })
    }),
  )
}

export function useTokens({
  tokens,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
}: UseTokensArgs & { enabled?: boolean; staleTime?: number }): { data: {
    address: string
    name: string
    symbol: string
    decimals: number
  }[] | undefined } {
  const _enabled = useMemo(() => {
    return Boolean(tokens && tokens?.length > 0 && enabled && tokens.map(el => el.address && el.chainId))
  }, [enabled, tokens])

  return useQuery(queryKey({ tokens }), queryFn, {
    enabled: _enabled,
    staleTime,
  })
}
