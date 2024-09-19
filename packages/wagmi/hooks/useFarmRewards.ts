import type { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import type { useBalance as useWagmiBalance } from 'wagmi'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import { useReadContracts } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'
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
  | Pick<ReturnType<typeof useReadContracts>, 'isError' | 'isLoading'>
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
  const blockNumber = useBlockNumber(chainId)
  const { address, abi } = getFarmingContractConfig(chainId)

  const poolInfoContracts = useMemo(
    () => pids.map(pid => ({
      address,
      abi,
      chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
      functionName: 'getPoolInfo',
      args: [BigInt(pid!)],
    } as const)),
    [abi, address, chainId, pids],
  )

  const userInfoContracts = useMemo(
    () => pids.map(pid => ({
      address,
      abi,
      chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
      functionName: 'getUserInfo',
      args: [BigInt(pid!), account as Address],
    } as const)),
    [abi, account, address, chainId, pids],
  )

  const pendingRewardsContracts = useMemo(
    () => pids.map(pid => ({
      address,
      abi,
      chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
      functionName: 'pendingRewards',
      args: [BigInt(pid!), account as Address],
    } as const)),
    [abi, account, address, chainId, pids],
  )

  const {
    data: _poolInfo,
    isError: isPoolInfoError,
    isLoading: isPoolInfoLoading,
    refetch: refetchPoolInfo,
  } = useReadContracts({ contracts: poolInfoContracts, allowFailure: true })

  const {
    data: _userInfo,
    isError: isUserInfoError,
    isLoading: isUserInfoLoading,
    refetch: refetchUserInfo,
  } = useReadContracts({ contracts: userInfoContracts, allowFailure: true })

  const {
    data: _pendingRewards,
    isError: isPendingRewardsError,
    isLoading: isPendingRewardsLoading,
    refetch: refetchPendingRewards,
  } = useReadContracts({ contracts: pendingRewardsContracts, allowFailure: true })

  useEffect(() => {
    if (watch && enabled && blockNumber) {
      refetchPoolInfo()
      refetchUserInfo()
      refetchPendingRewards()
    }
  }, [blockNumber, enabled, refetchPendingRewards, refetchPoolInfo, refetchUserInfo, watch])

  const balanceMap: FarmRewardsMap = useMemo(() => {
    const result: FarmRewardsMap = {}

    if (
      _poolInfo?.length !== poolInfoContracts.length
      || _userInfo?.length !== userInfoContracts.length
      || _pendingRewards?.length !== pendingRewardsContracts.length
    ) {
      return result
    }

    for (let i = 0; i < pids.length; i++) {
      const pid = pids[i]
      if (pid === undefined)
        continue

      const poolInfo = _poolInfo[i].result
      const pendingRewards = _pendingRewards[i].result
      const rewardTokens = poolInfo?.[2]
      const rewards = pendingRewards?.[0]
      const nextClaimableBlock = pendingRewards?.[1]

      if (rewardTokens && rewards && nextClaimableBlock) {
        result[pid] = {
          pid,
          nextClaimableBlock: nextClaimableBlock.toString(),
          userRewards: rewardTokens.map((tokenAddress, i) => {
            return {
              token: tokenAddress.toLowerCase(),
              amount: rewards[i]?.toString() ?? '0',
            }
          }),
        }
      }
    }
    return result
  }, [_poolInfo, poolInfoContracts.length, _userInfo?.length, userInfoContracts.length, _pendingRewards, pendingRewardsContracts.length, pids])

  return useMemo(() => ({
    data: balanceMap,
    isLoading: isPoolInfoLoading || isUserInfoLoading || isPendingRewardsLoading,
    isError: isPoolInfoError || isUserInfoError || isPendingRewardsError,
  }), [balanceMap, isPoolInfoLoading, isUserInfoLoading, isPendingRewardsLoading, isPoolInfoError, isUserInfoError, isPendingRewardsError])
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
    const balance = pid ? data?.[pid] : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [pid, data, isError, isLoading])
}
