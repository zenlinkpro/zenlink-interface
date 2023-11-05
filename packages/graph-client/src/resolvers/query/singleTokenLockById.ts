import { chainName, chainShortNameToChainId } from '@zenlink-interface/chain'
import omit from 'lodash.omit'
import { fetchSingleTokenLockById } from '../../queries'
import type { PoolFarm, SingleTokenLock, SingleTokenLockQueryData } from '../../types'
import { POOL_TYPE } from '../../types'

export async function singleTokenLockById(id: string): Promise<SingleTokenLock | undefined> {
  const [chainShortName, address] = id.split(':') as [string, string]
  const chainId = chainShortNameToChainId[chainShortName]

  const singleTokenLockTransformer = (queryMeta: SingleTokenLockQueryData, chainId: number) => {
    const feeApr = 0
    const volume1d = 0
    const volume7d = 0
    const fees1d = 0
    const fees7d = 0

    const farms = queryMeta.farm ?? []
    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number(cur.stakeApr)
      return stakeApr > best ? stakeApr : best
    }, 0)
    const apr = Number(feeApr) + bestStakeApr

    return {
      ...omit(queryMeta, ['singleTokenLockHourData', 'singleTokenLockDayData', 'farm']),
      type: POOL_TYPE.SINGLE_TOKEN_POOL,
      name: `${queryMeta?.token?.symbol}`,
      address: queryMeta.id,
      id: `${chainShortName}:${queryMeta.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName,
      token: {
        ...queryMeta.token,
        chainId,
      },
      poolHourData: (queryMeta.singleTokenLockHourData || []).map(item => ({
        ...item,
        hourlyVolumeUSD: '0',
        reserveUSD: item.totalLiquidityUSD,
      })),
      poolDayData: (queryMeta.singleTokenLockDayData || []).map(item => ({
        ...item,
        dailyVolumeUSD: '0',
        reserveUSD: item.totalLiquidityUSD,
      })),
      farm: queryMeta.farm as PoolFarm[],
      apr,
      bestStakeApr,
      reserveUSD: queryMeta.totalLiquidityUSD,
      swapFee: 0,
      feeApr,
      volume1d,
      volume7d,
      fees1d,
      fees7d,
    }
  }

  return fetchSingleTokenLockById(chainId, address)
    .then(data => data.data ? singleTokenLockTransformer(data.data, chainId) : undefined)
}
