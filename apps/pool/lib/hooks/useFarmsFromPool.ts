import { Token } from '@zenlink-interface/currency'
import type { Pool, PoolFarm } from '@zenlink-interface/graph-client'
import { useMemo } from 'react'

export const useFarmsFromPool = (pool: Pool) => {
  return useMemo(() => {
    const farm: PoolFarm[] = pool.farm ?? []
    const farms = farm.map((item) => {
      return {
        ...item,
        pid: item.pid,
        incentives: (item as any).incentives.map((item: any) => {
          return {
            ...item,
            token: new Token({
              chainId: pool.chainId,
              address: item.rewardToken.id,
              name: item.name,
              decimals: Number(item.rewardToken.decimals),
              symbol: item.rewardToken.symbol,
            }),
          }
        }),
      }
    })

    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number((cur as any)?.stakeApr ?? '0')
      return stakeApr > best ? stakeApr : best
    }, 0)

    return {
      bestStakeApr,
      farms,
    }
  }, [pool])
}
