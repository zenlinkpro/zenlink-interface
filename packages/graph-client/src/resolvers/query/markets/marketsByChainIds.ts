import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { MarketOrderByInput } from '../../../__generated__/market-types'
import type { MarketGraphData, MarketQueryData } from '../../../types'
import { fetchMarkets } from '../../../queries'

export interface QueryMarketsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: MarketOrderByInput
}

export async function marketsByChainIds({
  chainIds,
  limit = 200,
  orderBy = MarketOrderByInput.ReserveUsdDesc,
}: QueryMarketsByChainIdsArgs) {
  const marketsTransformer = (marketMetas: MarketQueryData[], chainId: number) =>
    marketMetas.map((marketMeta) => {
      const underlyingAPY = marketMeta.marketDayData[0]?.underlyingAPY
      const impliedAPY = marketMeta.marketDayData[0]?.impliedAPY
      const fixedROI = marketMeta.marketDayData[0]?.fixedROI
      const longYieldROI = marketMeta.marketDayData[0]?.longYieldROI

      return {
        ...marketMeta,
        id: `${chainShortName[chainId]}:${marketMeta.id}`,
        address: marketMeta.id,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        underlyingAPY: underlyingAPY || 0,
        impliedAPY: impliedAPY || 0,
        fixedROI: fixedROI || 0,
        longYieldROI: longYieldROI || 0,
      }
    })

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchMarkets({ chainId, limit, orderBy })
          .then(data =>
            data.data
              ? marketsTransformer(data.data, chainId)
              : [],
          ),
      ),
  ]).then(markets =>
    markets.flat().reduce<MarketGraphData[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
