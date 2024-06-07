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

  const ytBalanceCalls = useMemo(
    () => markets.map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: market.YT.address as Address,
      abi: ytABI,
      functionName: 'balanceOf',
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
    data: ytBalanceData,
    isLoading: isYtBalanceLoading,
    isError: isYtBalanceError,
    refetch: refetchYtBalance,
  } = useReadContracts({ contracts: ytBalanceCalls })

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
      refetchYtBalance()
    }
  }, [account, blockNumber, config?.enabled, refetchInterest, refetchRewards, refetchYtBalance])

  return useMemo(() => {
    if (!interestData || !ytBalanceData || !rewardsData) {
      return {
        isLoading: isInterestLoading || isYtBalanceLoading || isRewardsLoading,
        isError: isInterestError || isYtBalanceError || isRewardsError,
        data: [],
      }
    }

    let rewardDataIndex = 0
    return {
      isLoading: isInterestLoading || isYtBalanceLoading || isRewardsLoading,
      isError: isInterestError || isYtBalanceError || isRewardsError,
      data: markets.map((market, i) => {
        const interestIndex = interestData[i].result?.[0]
        const interestAccrued = interestData[i].result?.[1]
        const ytBalance = ytBalanceData[i].result

        const rewardTokens = market.YT.rewardTokens
        const rewards = rewardTokens.map((token) => {
          rewardDataIndex++
          const reward = rewardsData[rewardDataIndex].result

          if (!reward)
            return undefined
          return Amount.fromRawAmount(token, JSBI.BigInt(reward[1].toString()))
        })

        if (
          interestIndex === undefined
          || interestAccrued === undefined
          || ytBalance === undefined
          || rewards.includes(undefined)
        ) {
          return { market, interest: undefined, rewards: [] }
        }

        const pendingInterest = market.YT.calcPendingInterestOfUser(
          JSBI.BigInt(ytBalance.toString()),
          JSBI.BigInt(interestIndex.toString()),
        )

        return {
          market,
          interest: Amount.fromRawAmount(
            market.SY,
            JSBI.add(JSBI.BigInt(interestAccrued.toString()), pendingInterest),
          ),
          rewards: rewards as Amount<Token>[],
        }
      }),
    }
  }, [interestData, isInterestError, isInterestLoading, isRewardsError, isRewardsLoading, isYtBalanceError, isYtBalanceLoading, markets, rewardsData, ytBalanceData])
}
