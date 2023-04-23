import type { Amount, Token } from '@zenlink-interface/currency'
import type { Pool, PoolFarm } from '@zenlink-interface/graph-client'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useTokenAmountDollarValues } from '../lib/hooks'
import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface PoolPositionFarmRewards {
  pendingRewards: Amount<Token>[]
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
    if (!pool.farm)
      return {}
    return pool.farm.reduce<Record<number, PoolFarm>>((map, farm) => {
      map[farm.pid] = farm
      return map
    }, {})
  }, [pool.farm])

  const { farmStakedMap } = usePoolPositionStaked()

  const farmRewardsMap = useMemo(
    () => Object.fromEntries(
      Object.entries(farmsMap).map(([pid]) => {
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
      }),
    ),
    [farmStakedMap, farmsMap],
  )

  const totalPendingRewards = useMemo(
    () =>
      Object.entries(farmRewardsMap ?? {})
        .map(([, farmReward]) => farmReward.pendingRewards ?? [])
        .flat(),
    [farmRewardsMap],
  )

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
