import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { useEffect, useMemo } from 'react'
import { type Address, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'

function bigNumToCurrencyAmount(totalSupply?: bigint, token?: Token) {
  return token?.isToken && totalSupply ? Amount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export function useMultipleTotalSupply(tokens?: Token[]): Record<string, Amount<Token> | undefined> | undefined {
  const contracts = useMemo(() => {
    return (
      tokens?.map((token) => {
        return {
          address: token.wrapped.address as Address,
          chainId: chainsParachainIdToChainId[token.chainId],
          abi: erc20Abi,
          functionName: 'totalSupply',
        } as const
      }) || []
    )
  }, [tokens])

  const blockNumber = useBlockNumber(tokens?.[0].chainId)
  const { data, refetch } = useReadContracts({ contracts, allowFailure: true })

  useEffect(() => {
    if (blockNumber && tokens?.length)
      refetch()
  }, [blockNumber, refetch, tokens?.length])

  return useMemo(() => {
    return data
      ?.map((cs, i) => bigNumToCurrencyAmount(cs.result, tokens?.[i]))
      .reduce<Record<string, Amount<Token> | undefined>>((acc, curr, i) => {
        if (curr && tokens?.[i])
          acc[tokens[i]?.wrapped.address] = curr

        return acc
      }, {})
  }, [data, tokens])
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): Amount<Token> | undefined {
  const tokens = useMemo(() => (token ? [token] : undefined), [token])
  const resultMap = useMultipleTotalSupply(tokens)
  return useMemo(() => (token ? resultMap?.[token.wrapped.address] : undefined), [resultMap, token])
}
