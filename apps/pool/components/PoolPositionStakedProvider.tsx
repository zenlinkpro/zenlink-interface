import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { Pool, PoolFarm } from '@zenlink-interface/graph-client'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useAccount, useFarmBalances, useFarmsRewards } from '@zenlink-interface/compat'
import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { useTokensFromPool } from '@zenlink-interface/shared'
import { incentiveRewardToToken } from '../lib/functions'

interface UserReward {
  token: string
  amount: string
}

interface FarmPoolInfo {
  pid: number
  balance: Amount<Type> | undefined
  nextClaimableBlock?: number
  userRewards: UserReward []
}

interface PoolPositionStaked {
  balance: Amount<Type> | undefined
  pendingRewards: (Amount<Token> | undefined)[]
  rewardTokens: Token[]
  nextClaimableBlock?: number
  values?: number[]
}

interface PoolPositionRewardsContext {
  farmStakedMap: Record<number, PoolPositionStaked>
  balance: Amount<Type> | undefined
  values: number[]
  totalSupply: Amount<Token>
  reserves: Amount<Token>[]
  underlyings: Amount<Type>[]
  isLoading: boolean
  isError: boolean
}

const Context = createContext<PoolPositionRewardsContext | undefined>(undefined)

interface PoolPositionStakedProviderProps {
  pool: Pool
  children: ReactNode
  watch?: boolean
}

export const PoolPositionStakedProvider: FC<PoolPositionStakedProviderProps> = ({
  pool,
  children,
  watch = true,
}) => {
  const { address: account } = useAccount()
  const { reserves, liquidityToken, totalSupply } = useTokensFromPool(pool)
  const pids = useMemo(() => (pool.farm ?? []).map(farm => Number(farm.pid)), [pool.farm])
  const {
    data: _farmBalanceMap,
    isLoading,
    isError,
  } = useFarmBalances({ chainId: pool.chainId, pids, account, watch })
  const farmBalanceMap = useMemo(() => {
    return Object.entries(_farmBalanceMap ?? {}).reduce((total, [key, amount]) => {
      total[key] = Amount.fromRawAmount(liquidityToken, amount)
      return total
    }, {} as Record<number | string, Amount<Token>>)
  }, [_farmBalanceMap, liquidityToken])

  const {
    data: farmRewardMap,
    isLoading: isRewardsLoading,
    isError: isRewardsError,
  } = useFarmsRewards({ chainId: pool.chainId, pids, account, watch })

  const farmPoolInfoMap = useMemo(() => {
    return Object.entries(farmBalanceMap).reduce((total, [pid, amount]) => {
      const nextClaimableBlock = farmRewardMap?.[Number(pid)!]?.nextClaimableBlock ?? 0
      total[pid] = {
        pid: Number(pid),
        balance: amount,
        nextClaimableBlock: Number(nextClaimableBlock),
        userRewards: farmRewardMap?.[Number(pid)!]?.userRewards ?? [],
      }
      return total
    }, {} as Record<number | string, FarmPoolInfo>)
  }, [farmBalanceMap, farmRewardMap])

  const farmBalance = useMemo(() => {
    return Object.entries(farmBalanceMap ?? {}).reduce((total, [_key, amount]) => {
      return amount.add(total)
    }, Amount.fromRawAmount(liquidityToken, 0))
  }, [farmBalanceMap, liquidityToken])
  const farmsMap = useMemo(() => {
    return (pool.farm ?? []).reduce((map, cur) => {
      map[cur.pid] = cur
      return map
    }, {} as Record<number, PoolFarm>)
  }, [pool.farm])

  const farmUnderlyings = useUnderlyingTokenBalanceFromPool({
    reserves,
    totalSupply,
    balance: farmBalance,
  })

  const farmValues = useTokenAmountDollarValues({ chainId: pool.chainId, amounts: farmUnderlyings })

  const farmStakedMap = useMemo(() => {
    return Object.fromEntries(Object.entries(farmsMap).map(([pid, farm]) => {
      const farmPoolInfo = farmPoolInfoMap?.[Number(pid)]
      const userRewardsMap = (farmPoolInfo?.userRewards ?? []).reduce((map, reward) => {
        map[reward.token.toLowerCase()] = reward
        return map
      }, {} as Record<string, { token: string; amount: string }>)

      const incentives = farm?.incentives ?? []

      const pendingRewards = incentives.map((incentive) => {
        const token = incentiveRewardToToken(pool.chainId, incentive)
        const reward = userRewardsMap[token?.address.toLowerCase()]?.amount
        return Amount.fromRawAmount(token, reward ?? 0)
      })

      const rewardTokens = pendingRewards.map(reward => reward.currency as Token)

      const balance = farmPoolInfo?.balance

      const farmRewards: PoolPositionStaked = {
        balance,
        pendingRewards,
        rewardTokens,
        nextClaimableBlock: farmPoolInfo?.nextClaimableBlock,
        values: [],
      }

      return [Number(pid), farmRewards]
    }))
  }, [farmPoolInfoMap, farmsMap, pool.chainId])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          values: farmValues,
          underlyings: farmUnderlyings,
          balance: farmBalance,
          totalSupply,
          isLoading: isLoading || isRewardsLoading,
          isError: isError || isRewardsError,
          reserves,
          farmStakedMap,
        }),
        [farmBalance, farmStakedMap, farmUnderlyings, farmValues, isError, isLoading, isRewardsError, isRewardsLoading, reserves, totalSupply],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPositionStaked = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Pool Position Context')

  return context
}
