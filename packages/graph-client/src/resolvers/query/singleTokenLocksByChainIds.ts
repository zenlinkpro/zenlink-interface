import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import omit from 'lodash.omit'
import { fetchSingleTokenLocks } from '../../queries'
import type { SingleTokenLock, SingleTokenLockQueryData } from '../../types'
import { POOL_TYPE } from '../../types'
import { SingleTokenLockOrderByInput } from '../../__generated__/types-and-hooks'

export interface QuerySingleTokenLocksByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: SingleTokenLockOrderByInput
}

export const singleTokenLocksByChainIds = async ({
  chainIds,
  limit = 200,
  orderBy = SingleTokenLockOrderByInput.TotalLiquidityUsdDesc,
}: QuerySingleTokenLocksByChainIdsArgs) => {
  const singleTokenLocksTransformer = (queryMetas: SingleTokenLockQueryData[], chainId: number) =>
    queryMetas.map((queryMeta) => {
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
        ...omit(queryMeta, ['singleTokenLockHourData', 'singleTokenLockDayData']),
        type: POOL_TYPE.SINGLE_TOKEN_POOL,
        name: `${queryMeta?.token?.symbol}`,
        address: queryMeta.id,
        id: `${chainShortName[chainId]}:${queryMeta.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        token: {
          ...queryMeta.token,
          chainId,
        },
        poolHourData: (queryMeta.singleTokenLockHourData || []).map(item => ({
          ...item,
          dailyVolumeUSD: 0,
          reserveUSD: item.totalLiquidityUSD,
        })),
        poolDayData: (queryMeta.singleTokenLockDayData || []).map(item => ({
          ...item,
          dailyVolumeUSD: 0,
          reserveUSD: item.totalLiquidityUSD,
        })),
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
    })

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchSingleTokenLocks({ chainId, limit, orderBy })
          .then(data =>
            data.data
              ? singleTokenLocksTransformer(data.data, chainId)
              : [],
          ),
      ),
  ]).then(pairs =>
    pairs.flat().reduce<SingleTokenLock[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled') {
        const value = currentValue.value as any[]
        previousValue.push(...value)
      }
      return previousValue
    }, []),
  )
}
