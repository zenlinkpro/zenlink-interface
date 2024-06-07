import { ParachainId, chainName, chainShortName } from '@zenlink-interface/chain'
import type { MarketGraphData, MarketQueryData } from '../../../types'
import { fetchMarketById } from '../../../queries'

export async function marketById(id: string): Promise<MarketGraphData | undefined> {
  const chainId = ParachainId.MOONBEAM

  const marketTransformer = (marketMeta: MarketQueryData, chainId: number): MarketGraphData => {
    const underlyingAPY = marketMeta.marketDayData[0].underlyingAPY
    const impliedAPY = marketMeta.marketDayData[0].impliedAPY
    const fixedAPY = marketMeta.marketDayData[0].fixedAPY

    return {
      ...marketMeta,
      id: marketMeta.id,
      address: marketMeta.id,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      underlyingAPY: underlyingAPY || 0,
      impliedAPY: impliedAPY || 0,
      fixedAPY: fixedAPY || 0,
    }
  }

  return fetchMarketById(chainId, id)
    .then(data => data.data ? marketTransformer(data.data, chainId) : undefined)
}
