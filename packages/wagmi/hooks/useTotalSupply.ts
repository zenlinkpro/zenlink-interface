import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { useMemo } from 'react'
import type { Address } from 'wagmi'
import { erc20ABI, useContractReads } from 'wagmi'

function bigNumToCurrencyAmount(totalSupply?: bigint, token?: Token) {
  return token?.isToken && totalSupply ? Amount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export const useMultipleTotalSupply = (tokens?: Token[]): Record<string, Amount<Token> | undefined> | undefined => {
  const contracts = useMemo(() => {
    return (
      tokens?.map((token) => {
        return {
          address: token.wrapped.address as Address,
          chainId: chainsParachainIdToChainId[token.chainId],
          abi: erc20ABI,
          functionName: 'totalSupply',
        } as const
      }) || []
    )
  }, [tokens])

  const { data } = useContractReads({
    contracts,
    enabled: tokens && tokens.length > 0,
    watch: true,
    keepPreviousData: false,
  })

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
export const useTotalSupply = (token?: Token): Amount<Token> | undefined => {
  const tokens = useMemo(() => (token ? [token] : undefined), [token])
  const resultMap = useMultipleTotalSupply(tokens)
  return useMemo(() => (token ? resultMap?.[token.wrapped.address] : undefined), [resultMap, token])
}
