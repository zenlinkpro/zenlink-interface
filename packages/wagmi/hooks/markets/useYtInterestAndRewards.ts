import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import type { Address } from 'viem'
import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useAccount, useReadContracts } from 'wagmi'
import { JSBI } from '@zenlink-interface/math'
import { useBlockNumber } from '../useBlockNumber'
import { yt as ytABI } from '../../abis'

export interface YtInterestAndRewardsResult {
  market: Market
  interest: Amount<Token> | undefined
  rewards: Amount<Token>[]
}

interface UseYtInterestAndRewardsReturn {
  isLoading: boolean
  isError: boolean
  data: YtInterestAndRewardsResult[] | undefined
}

export function useYtInterestAndRewards(
  chainId: number | undefined,
  markets: Market[],
  config: { enabled?: boolean } = { enabled: true },
): UseYtInterestAndRewardsReturn {
  const { address: account } = useAccount()
  const blockNumber = useBlockNumber(chainId)

  const interestCalls = useMemo(
    () => markets.map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: market.YT.address as Address,
      abi: ytABI,
      functionName: 'userInterest',
      args: [account],
    }) as const),
    [account, chainId, markets],
  )

  const rewardsCalls = useMemo(
    () => markets.map(
      market =>
        market.YT.rewardTokens.map(token => ({
          chainId: chainsParachainIdToChainId[chainId ?? -1],
          address: market.YT.address as Address,
          abi: ytABI,
          functionName: 'userReward',
          args: [token.address as Address, account],
        }) as const))
      .flat(),
    [account, chainId, markets],
  )

  const {
    data: interestData,
    isLoading: isInterestLoading,
    isError: isInterestError,
    refetch: refetchInterest,
  } = useReadContracts({ contracts: interestCalls })
  const {
    data: rewardsData,
    isLoading: isRewardsLoading,
    isError: isRewardsError,
    refetch: refetchRewards,
  } = useReadContracts({ contracts: rewardsCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber && account) {
      refetchInterest()
      refetchRewards()
    }
  }, [account, blockNumber, config?.enabled, refetchInterest, refetchRewards])

  return useMemo(() => {
    if (!interestData || !rewardsData) {
      return {
        isLoading: isInterestLoading || isRewardsLoading,
        isError: isInterestError || isRewardsError,
        data: [],
      }
    }

    let rewardDataIndex = 0
    return {
      isLoading: isInterestLoading || isRewardsLoading,
      isError: isInterestError || isRewardsError,
      data: markets.map((market, i) => {
        const interest = interestData[i].result
        const rewardTokens = market.YT.rewardTokens
        const rewards = rewardTokens.map((token) => {
          const reward = rewardsData[rewardDataIndex].result
          rewardDataIndex++

          if (!reward)
            return undefined
          return Amount.fromRawAmount(token, JSBI.BigInt(reward[1].toString()))
        })

        if (!interest || rewards.includes(undefined))
          return { market, interest: undefined, rewards: [] }

        return {
          market,
          interest: Amount.fromRawAmount(market.SY, JSBI.BigInt(interest[1].toString())),
          rewards: rewards as Amount<Token>[],
        }
      }),
    }
  }, [interestData, isInterestError, isInterestLoading, isRewardsError, isRewardsLoading, markets, rewardsData])
}
