import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { useMemo } from 'react'
import type { Address, useBalance as useWagmiBalance } from 'wagmi'
import { useContractReads } from 'wagmi'
import { getFarmingContractConfig } from './useFarming'

interface UserReward {
  token: string
  amount: string
}

interface FarmReward {
  pid: number
  nextClaimableBlock?: string
  nextClaimableTime?: string
  userRewards: UserReward[]
}

interface UseFarmsRewardsParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type FarmRewardsMap = Record<number, FarmReward>

type UseFarmsRewards = (params: UseFarmsRewardsParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useWagmiBalance>, 'isError' | 'isLoading'>
) & {
  data: FarmRewardsMap
}

export const useFarmsRewards: UseFarmsRewards = ({
  watch = true,
  enabled = true,
  chainId,
  account,
  pids = [],
}) => {
  const contracts = useMemo(() => {
    const wagmiFarmingContract = getFarmingContractConfig(chainId)
    return pids.map((pid) => {
      return [
        {
          address: wagmiFarmingContract.address as Address,
          abi: wagmiFarmingContract.abi,
          chainId: chainsParachainIdToChainId[chainId ?? -1],
          functionName: 'getPoolInfo',
          args: [pid],
        },
        {
          address: wagmiFarmingContract.address as Address,
          abi: wagmiFarmingContract.abi,
          chainId: chainsParachainIdToChainId[chainId ?? -1],
          functionName: 'getUserInfo',
          args: [pid, account],
        },
        {
          address: wagmiFarmingContract.address as Address,
          abi: wagmiFarmingContract.abi,
          chainId: chainsParachainIdToChainId[chainId ?? -1],
          functionName: 'pendingRewards',
          args: [pid, account],
        },
      ]
    }).flat()
  }, [account, chainId, pids])

  const { data, isError, isLoading } = useContractReads({
    contracts,
    enabled,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
    keepPreviousData: true,
  })

  const balanceMap: FarmRewardsMap = useMemo(() => {
    const result: FarmRewardsMap = {}

    if (data?.length !== contracts.length)
      return result
    for (let i = 0; i < (pids.length / 3); i = i + 3) {
      const poolInfo = data[i] as any
      // const userInfo = data[i + 1] as any
      const pendingRewards = data[i + 2] as any
      const rewardTokens = poolInfo?.rewardTokens ?? []
      const rewards = pendingRewards?.rewards ?? []
      const nextClaimableBlock = pendingRewards?.nextClaimableBlock?.toString()
      if (rewardTokens && rewards) {
        if (pids[i] !== undefined) {
          result[pids[i]!] = {
            pid: pids[i]!,
            nextClaimableBlock,
            userRewards: rewardTokens.map((item: string, i: any) => {
              return {
                token: item.toLowerCase(),
                amount: rewards[i]?.toString() ?? '0',
              }
            }),
          }
        }
      }
    }
    return result
  }, [data, contracts.length, pids])

  return useMemo(() => ({
    data: balanceMap,
    isLoading,
    isError,
  }), [balanceMap, isLoading, isError])
}

interface UseFarmRewardsParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  pid: number
  enabled?: boolean
  watch?: boolean
}

type UseFarmRewards = (params: UseFarmRewardsParams) => Pick<ReturnType<typeof useFarmsRewards>, 'isError' | 'isLoading'> & {
  data?: FarmReward
}

export const useFarmReward: UseFarmRewards = ({
  watch = true,
  chainId,
  account,
  enabled = true,
  pid,
}) => {
  const pids = useMemo(() => [pid], [pid])
  const { data, isLoading, isError } = useFarmsRewards({ watch, chainId, pids, account, enabled })

  return useMemo(() => {
    const balance = pid
      ? data?.[pid]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [pid, data, isError, isLoading])
}
