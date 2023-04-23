import type { Amount, Token } from '@zenlink-interface/currency'
import type { Pool, PoolFarm } from '@zenlink-interface/graph-client'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useTokenAmountDollarValues } from '../lib/hooks'
import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface PoolPositionFarmRewards {
  pendingRewards: (Amount<Token> | undefined)[]
  rewardTokens: Token[]
  values?: number[]
  nextClaimableBlock?: number
}

interface PoolPositionRewardsContext {
  farmRewardsMap: Record<number, PoolPositionFarmRewards>
  values: number[]
  isLoading: boolean
  isError: boolean
}

const Context = createContext<PoolPositionRewardsContext | undefined>(undefined)

interface PoolPositionRewardsProviderProps {
  pool: Pool
  children: ReactNode
}

export const PoolPositionRewardsProvider: FC<PoolPositionRewardsProviderProps> = ({
  pool,
  children,
}) => {
  const farmsMap = useMemo(() => {
    return (pool.farm ?? []).reduce((map, cur) => {
      map[cur.pid] = cur
      return map
    }, {} as Record<number, PoolFarm>)
  }, [pool.farm])

  const { farmStakedMap } = usePoolPositionStaked()

  const farmRewardsMap = useMemo(() => {
    return Object.fromEntries(Object.entries(farmsMap).map(([pid, _farm]) => {
      const farmPoolInfo = farmStakedMap?.[Number(pid)]
      const pendingRewards = farmPoolInfo.pendingRewards

      const rewardTokens = pendingRewards.map(reward => reward?.currency as Token)

      const farmRewards: PoolPositionFarmRewards = {
        pendingRewards,
        rewardTokens,
        nextClaimableBlock: farmPoolInfo?.nextClaimableBlock,
        values: [],
      }

      return [Number(pid), farmRewards]
    }))
  }, [farmStakedMap, farmsMap])

  const totalPendingRewards = useMemo(() => {
    return Object.entries(farmRewardsMap ?? {}).map(([_pid, farmReward]) => {
      return farmReward.pendingRewards ?? []
    }).flat()
  }, [farmRewardsMap])

  const values = useTokenAmountDollarValues({
    chainId: pool.chainId,
    amounts: totalPendingRewards,
  })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          values,
          isLoading: false,
          isError: false,
          farmRewardsMap,
        }),
        [farmRewardsMap, values],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPositionRewards = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Pool Position Context')

  return context
}
