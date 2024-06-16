import { ParachainId, chainName, chainShortName } from '@zenlink-interface/chain'
import type { MarketGraphData, MarketQueryData } from '../../../types'
import { fetchMarketById } from '../../../queries'

export async function marketById(id: string): Promise<MarketGraphData | undefined> {
  const chainId = ParachainId.MOONBEAM

  const marketTransformer = (marketMeta: MarketQueryData, chainId: number): MarketGraphData => {
    const underlyingAPY = marketMeta.marketDayData[0]?.underlyingAPY
    const impliedAPY = marketMeta.marketDayData[0]?.impliedAPY
    const fixedROI = marketMeta.marketDayData[0]?.fixedROI
    const longYieldROI = marketMeta.marketDayData[0]?.longYieldROI

    return {
      ...marketMeta,
      id: marketMeta.id,
      address: marketMeta.id,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      underlyingAPY: underlyingAPY || 0,
      impliedAPY: impliedAPY || 0,
      fixedROI: fixedROI || 0,
      longYieldROI: longYieldROI || 0,
    }
  }

  return fetchMarketById(chainId, id)
    .then(data => data.data ? marketTransformer(data.data, chainId) : undefined)
}
