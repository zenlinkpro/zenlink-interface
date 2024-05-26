import type { QueryFunction } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { type Address, erc20Abi } from 'viem'
import { readContracts } from 'wagmi/actions'
import { config } from '../client'

export interface FetchTokensArgs { tokens: { address: string, chainId: number }[] }
export type UseTokensArgs = Partial<FetchTokensArgs>
export type FetchTokensResult = { decimals?: number, name?: string, symbol?: string, address: Address }[]
export type UseTokensConfig = Partial<Parameters<typeof useQuery>['0']>

function queryKey({ tokens }: FetchTokensArgs) {
  return [{ entity: 'tokens', tokens: tokens || [] }] as const
}

const queryFn: QueryFunction<FetchTokensResult, ReturnType<typeof queryKey>> = async ({ queryKey: [{ tokens }] }) => {
  if (!tokens)
    throw new Error('tokens is required')
  if (tokens.filter(el => !el.address).length > 0)
    throw new Error('address is required')

  const result = await Promise.all(
    tokens.map(token =>
      readContracts(config, {
        allowFailure: true,
        contracts: [
          {
            chainId: token.chainId,
            address: token.address as Address,
            abi: erc20Abi,
            functionName: 'decimals',
          },
          {
            chainId: token.chainId,
            address: token.address as Address,
            abi: erc20Abi,
            functionName: 'name',
          },
          {
            chainId: token.chainId,
            address: token.address as Address,
            abi: erc20Abi,
            functionName: 'symbol',
          },
        ],
      }),
    ),
  )

  return result.map((info, i) => ({
    address: tokens[i].address as Address,
    decimals: info[0].result,
    name: info[1].result,
    symbol: info[2].result,
  }))
}

export function useTokens({
  tokens = [],
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
}: UseTokensArgs & UseTokensConfig): { data: {
  address: string
  name: string
  symbol: string
  decimals: number
}[] | undefined } {
  const _enabled = useMemo(() => {
    return Boolean(tokens && tokens?.length > 0 && enabled && tokens.map(el => el.address && el.chainId))
  }, [enabled, tokens])

  return useQuery({
    queryKey: queryKey({ tokens }),
    queryFn,
    enabled: _enabled,
    staleTime,
  })
}
