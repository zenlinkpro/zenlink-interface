import type { ParachainId } from '@zenlink-interface/chain'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import { omit } from 'lodash'
import { fetchPairs } from '../../queries'
import type { Pair, PairMeta } from '../../types'
import { POOL_TYPE } from '../../types'

export interface QueryPairsByChainIdsArgs {
  chainIds: ParachainId[]
  limit?: number
  orderBy?: string
}

export const pairsByChainIds = async ({
  chainIds,
  limit = 250,
  orderBy = 'reserveUSD_DESC',
}: QueryPairsByChainIdsArgs) => {
  const pairsTransformer = (pairMetas: PairMeta[], chainId: number) =>
    pairMetas.map((pairMeta) => {
      const vloumeUSDOneWeek = pairMeta.pairDayData
        .slice(0, 7)
        .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
      const feeApr = Number(pairMeta?.reserveUSD) > 500
        ? (vloumeUSDOneWeek * 0.0015 * 365) / (Number(pairMeta?.reserveUSD) * 7)
        : 0
      const apr = Number(feeApr)

      return {
        ...omit(pairMeta, ['pairHourData', 'pairDayData']),
        type: POOL_TYPE.STANDARD_POOL,
        name: `${pairMeta}-${pairMeta.token1.symbol}`,
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
        poolHourData: pairMeta.pairHourData,
        poolDayData: pairMeta.pairDayData,
        apr,
        feeApr,
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
