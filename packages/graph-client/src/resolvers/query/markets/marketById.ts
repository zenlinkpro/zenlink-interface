import { chainName, chainShortNameToChainId } from '@zenlink-interface/chain'
import type { MarketGraphData, MarketQueryData } from '../../../types'
import { fetchMarketById } from '../../../queries'

export async function marketById(id: string): Promise<MarketGraphData | undefined> {
  const [chainShortName, address] = id.split(':') as [string, string]
  const chainId = chainShortNameToChainId[chainShortName]

  const marketTransformer = (marketMeta: MarketQueryData, chainId: number): MarketGraphData => {
    const underlyingAPY = marketMeta.marketDayData[0].underlyingAPY
    const impliedAPY = marketMeta.marketDayData[0].impliedAPY
    const fixedAPY = marketMeta.marketDayData[0].fixedAPY

    return {
      ...marketMeta,
      id: `${chainShortName[chainId]}:${marketMeta.id}`,
      address: marketMeta.id,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      underlyingAPY: underlyingAPY || 0,
      impliedAPY: impliedAPY || 0,
      fixedAPY: fixedAPY || 0,
    }
  }

  return fetchMarketById(chainId, address)
    .then(data => data.data ? marketTransformer(data.data, chainId) : undefined)
}
