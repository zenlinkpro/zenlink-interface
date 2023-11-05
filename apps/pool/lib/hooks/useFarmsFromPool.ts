import { Token } from '@zenlink-interface/currency'
import type { Pool, PoolFarm } from '@zenlink-interface/graph-client'
import { useMemo } from 'react'

export interface Incentive {
  token: Token
  rewardPerDay: string
}

export interface PoolFarmWithIncentives extends Omit<PoolFarm, 'incentives'> {
  incentives: Incentive[]
}

export interface FarmsFromPool {
  bestStakeApr: number
  farms: PoolFarmWithIncentives[]
}

export function useFarmsFromPool(pool: Pool): FarmsFromPool {
  return useMemo(() => {
    const farms = (pool.farm ?? []).map(farm => ({
      ...farm,
      incentives: farm.incentives.map((incentive) => {
        return {
          ...incentive,
          token: new Token({
            chainId: pool.chainId,
            address: incentive.rewardToken.id,
            name: incentive.rewardToken.name,
            decimals: incentive.rewardToken.decimals,
            symbol: incentive.rewardToken.symbol,
          }),
        }
      }),
    }))

    const bestStakeApr = farms.reduce(
      (best, farm) => Number(farm.stakeApr) > best ? Number(farm.stakeApr) : best,
      0,
    )

    return { bestStakeApr, farms }
  }, [pool])
}
