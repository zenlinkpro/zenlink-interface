import type { Market } from '@zenlink-interface/market'
import { useAccount, useReadContracts } from 'wagmi'
import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { Amount, Token, ZLK } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { useBlockNumber } from '../useBlockNumber'
import { market as marketABI } from '../../abis'
import { useTokens } from '../useTokens'
import { useRewardsData } from './useRewardsData'

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
  const { data: rewardsData } = useRewardsData(chainId, markets)

  const rewardStatesCalls = useMemo(
    () => rewardTokens?.length
      ? markets.map(
        (market, i) =>
          (rewardTokens[i] || []).map(token => ({
            chainId: chainsParachainIdToChainId[chainId ?? -1],
            address: market.address as Address,
            abi: marketABI,
            functionName: 'rewardState',
            args: [token.address],
          }) as const),
      ).flat()
      : [],
    [chainId, markets, rewardTokens],
  )

  const userRewardsCalls = useMemo(
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

  const activeBalanceCalls = useMemo(
    () => markets.map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: market.address as Address,
      abi: marketABI,
      functionName: 'activeBalance',
      args: [account],
    }) as const),
    [account, chainId, markets],
  )

  const {
    data: rewardStatesData,
    isLoading: isRewardStatesLoading,
    isError: isRewardStatesError,
    refetch: refetchRewardStates,
  } = useReadContracts({ contracts: rewardStatesCalls })

  const {
    data: userRewardsData,
    isLoading: isUserRewardsLoading,
    isError: isUserRewardsError,
    refetch: refetchUserRewards,
  } = useReadContracts({ contracts: userRewardsCalls })

  const {
    data: acBalanceData,
    isLoading: isAcBalanceLoading,
    isError: isAcBalanceError,
    refetch: refetchAcBalance,
  } = useReadContracts({ contracts: activeBalanceCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber && account) {
      refetchUserRewards()
      refetchAcBalance()
    }
  }, [account, blockNumber, config?.enabled, refetchAcBalance, refetchUserRewards])

  return useMemo(() => {
    if (!userRewardsData || !acBalanceData || !rewardStatesData || !rewardTokens) {
      return {
        isLoading: isRewardStatesLoading || isUserRewardsLoading || isAcBalanceLoading,
        isError: isRewardStatesError || isUserRewardsError || isAcBalanceError,
        data: [],
      }
    }

    let rewardDataIndex = 0
    return {
      isLoading: isRewardStatesLoading || isUserRewardsLoading || isAcBalanceLoading,
      isError: isRewardStatesError || isUserRewardsError || isAcBalanceError,
      data: markets.map((market, i) => {
        const tokens = rewardTokens[i]
        const rewardData = rewardsData[i]
        const acBalance = acBalanceData[i]?.result

        if (!acBalance || !rewardData || !tokens.length)
          return []

        return tokens.map((token) => {
          const rewardStateData = rewardStatesData[rewardDataIndex]?.result
          const userRewardData = userRewardsData[rewardDataIndex]?.result
          rewardDataIndex++

          if (!rewardStateData || !userRewardData)
            return Amount.fromRawAmount(token, 0)

          const pendingRewards = market.calcPendingRewards(
            token.equals(ZLK[chainId ?? -1]) ? rewardData : undefined,
            JSBI.BigInt(rewardStateData[0].toString()),
            JSBI.BigInt(userRewardData[0].toString()),
            JSBI.BigInt(acBalance.toString()),
          )

          return Amount.fromRawAmount(
            token,
            JSBI.add(JSBI.BigInt(userRewardData[1].toString()), pendingRewards),
          )
        })
      }),
    }
  }, [acBalanceData, chainId, isAcBalanceError, isAcBalanceLoading, isRewardStatesError, isRewardStatesLoading, isUserRewardsError, isUserRewardsLoading, markets, rewardStatesData, rewardTokens, rewardsData, userRewardsData])
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
