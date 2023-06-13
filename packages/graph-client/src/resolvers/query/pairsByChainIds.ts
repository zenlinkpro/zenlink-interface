import { STANDARD_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import omit from 'lodash.omit'
import { fetchPairs } from '../../queries'
import type { Pair, PairQueryData, PoolFarm } from '../../types'
import { POOL_TYPE } from '../../types'
import { PairOrderByInput } from '../../__generated__/types-and-hooks'

export interface QueryPairsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: PairOrderByInput
}

export const pairsByChainIds = async ({
  chainIds,
  limit = 200,
  orderBy = PairOrderByInput.ReserveUsdDesc,
}: QueryPairsByChainIdsArgs) => {
  const pairsTransformer = (pairMetas: PairQueryData[], chainId: number) =>
    pairMetas.map((pairMeta) => {
      const vloumeUSDOneWeek = pairMeta.pairDayData
        .slice(0, 7)
        .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
      const feeApr = Number(pairMeta?.reserveUSD) > 500
        ? (vloumeUSDOneWeek * STANDARD_SWAP_FEE_NUMBER * 365) / (Number(pairMeta?.reserveUSD) * 7)
        : 0
      const farms = pairMeta.farm ?? []
      const bestStakeApr = farms.reduce((best, cur) => {
        const stakeApr = Number(cur.stakeApr)
        return stakeApr > best ? stakeApr : best
      }, 0)
      const apr = Number(feeApr) + bestStakeApr
      const currentHourIndex = parseInt((new Date().getTime() / 3600000).toString(), 10)
      const hourStartUnix = Number(currentHourIndex - 24) * 3600000
      const volume1d = pairMeta.pairHourData
        .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix)
        .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
      const volume7d = pairMeta.pairDayData
        .slice(0, 7).reduce((volume, { dailyVolumeUSD }) => volume + Number(dailyVolumeUSD), 0)
      const fees1d = volume1d * STANDARD_SWAP_FEE_NUMBER
      const fees7d = volume7d * STANDARD_SWAP_FEE_NUMBER

      return {
        ...omit(pairMeta, ['pairHourData', 'pairDayData', 'farm']),
        type: POOL_TYPE.STANDARD_POOL,
        name: `${pairMeta.token0.symbol}-${pairMeta.token1.symbol}`,
        address: pairMeta.id,
        id: `${chainShortName[chainId]}:${pairMeta.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        token0: {
          ...pairMeta.token0,
          chainId,
        },
        token1: {
          ...pairMeta.token1,
          chainId,
        },
        farm: pairMeta.farm as PoolFarm[],
        poolHourData: pairMeta.pairHourData || [],
        poolDayData: pairMeta.pairDayData || [],
        apr,
        swapFee: STANDARD_SWAP_FEE_NUMBER,
        feeApr,
        bestStakeApr,
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
        fetchPairs({ chainId, limit, orderBy })
          .then(data =>
            data.data
              ? pairsTransformer(data.data, chainId)
                .filter(({ reserve0, reserve1 }) => Number(reserve0) > 0 && Number(reserve1) > 0)
              : [],
          ),
      ),
  ]).then(pairs =>
    pairs.flat().reduce<Pair[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
