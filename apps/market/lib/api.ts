import type { MarketGraphData } from '@zenlink-interface/graph-client'
import { marketsByChainIds } from '@zenlink-interface/graph-client'
import { SUPPORTED_CHAIN_IDS } from 'config'

export async function getMarkets(): Promise<MarketGraphData[]> {
  try {
    const markets = await marketsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS })
    return markets
  }
  catch (err) {
    return []
  }
}
