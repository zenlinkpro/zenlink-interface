import type { ParachainId } from '@zenlink-interface/chain'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import { fetchPairs } from '../../queries'
import type { Pair, PairMeta } from '../../types'

export interface QuerypairsByChainIdsArgs {
  chainIds: ParachainId[]
  limit?: number
  orderBy?: string
}

export const pairsByChainIds = async ({
  chainIds,
  limit = 250,
  orderBy = 'reserveUSD_DESC',
}: QuerypairsByChainIdsArgs) => {
  const pairsTransformer = (pairMetas: PairMeta[], chainId: number) =>
    pairMetas.map((pairMeta) => {
      const vloumeUSDOneWeek = pairMeta.pairDayData.reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
      const feeApr = Number(pairMeta?.reserveUSD) > 500
        ? (vloumeUSDOneWeek * 0.0015 * 365) / (Number(pairMeta?.reserveUSD) * 7)
        : 0
      const apr = Number(feeApr)

      return {
        ...pairMeta,
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
            data.data ? pairsTransformer(data.data, chainId) : [],
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
