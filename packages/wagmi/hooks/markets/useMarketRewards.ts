import type { Market } from '@zenlink-interface/market'
import { useAccount, useReadContracts } from 'wagmi'
import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { Amount, Token } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { useBlockNumber } from '../useBlockNumber'
import { market as marketABI } from '../../abis'
import { useTokens } from '../useTokens'

interface UseMarketRewardsReturn {
  isLoading: boolean
  isError: boolean
  data: Amount<Token>[][] | undefined
}

export function useMarketRewards(
  chainId: number | undefined,
  markets: Market[],
  config: { enabled?: boolean } = { enabled: true },
): UseMarketRewardsReturn {
  const { address: account } = useAccount()
  const blockNumber = useBlockNumber(chainId)

  const { data: rewardTokens } = useMarketRewardTokens(chainId, markets)

  const rewardsCalls = useMemo(
    () => rewardTokens?.length
      ? markets.map(
        (market, i) =>
          (rewardTokens[i] || []).map(token => ({
            chainId: chainsParachainIdToChainId[chainId ?? -1],
            address: market.address as Address,
            abi: marketABI,
            functionName: 'userReward',
            args: [token.address, account],
          }) as const),
      ).flat()
      : [],
    [account, chainId, markets, rewardTokens],
  )

  const {
    data: rewardsData,
    isLoading,
    isError,
    refetch,
  } = useReadContracts({ contracts: rewardsCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber && account)
      refetch()
  }, [account, blockNumber, config?.enabled, refetch])

  return useMemo(() => {
    if (!rewardsData || !rewardTokens)
      return { isLoading, isError, data: [] }

    let rewardDataIndex = 0
    return {
      isLoading,
      isError,
      data: markets.map((_, i) => {
        const rewardData = rewardsData[rewardDataIndex]?.result
        const tokens = rewardTokens[i]

        if (!rewardData || !tokens.length)
          return []

        return tokens.map((token) => {
          rewardDataIndex++
          return Amount.fromRawAmount(token, JSBI.BigInt(rewardData[1].toString()))
        })
      }),
    }
  }, [isError, isLoading, markets, rewardTokens, rewardsData])
}

interface UseMarketRewardTokensReturn {
  isLoading: boolean
  isError: boolean
  data: Token[][] | undefined
}

export function useMarketRewardTokens(
  chainId: number | undefined,
  markets: Market[],
): UseMarketRewardTokensReturn {
  const blockNumber = useBlockNumber(chainId)

  const rewardTokensCalls = useMemo(
    () => markets.map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: market.address as Address,
      abi: marketABI,
      functionName: 'getRewardTokens',
    }) as const),
    [chainId, markets],
  )

  const { data, isLoading, isError } = useReadContracts({ contracts: rewardTokensCalls })

  const tokensFetchArgs = useMemo(() => {
    if (!data || !chainId)
      return { tokens: [] }

    return {
      tokens: Array.from(
        new Set(
          data.map(d => (d.result || []).map(address => ({ chainId, address }))).flat(),
        ),
      ),
    }
  }, [chainId, data])

  const tokensResult = useTokens(tokensFetchArgs)

  return useMemo(() => {
    if (!data || !chainId)
      return { isLoading, isError, data: undefined }

    const tokenMap: Record<string, Token> = tokensResult.data?.reduce((prev, token) => {
      return {
        ...prev,
        [token.address]: new Token({ chainId, ...token }),
      }
    }, {}) || {}

    return {
      isLoading,
      isError,
      data: data.map((d) => {
        if (!d.result)
          return []
        return d.result.map(address => tokenMap[address]).filter(t => !!t)
      }),
    }
  }, [chainId, data, isError, isLoading, tokensResult.data])
}
