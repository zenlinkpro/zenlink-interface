import 'dotenv/config'

import { ParachainId } from '@zenlink-interface/chain'
import { DataFetcher } from '@zenlink-interface/smart-router'
import { providers } from 'ethers'

export const SUPPORTED_CHAINS = [
  ParachainId.ASTAR,
]

export const DATAFETCHER_MAP: Record<number, DataFetcher> = {
  [ParachainId.ASTAR]: new DataFetcher(
    new providers.JsonRpcProvider(process.env.ASTAR_ENDPOINT_URL, 592),
    ParachainId.ASTAR,
  ),
}

export function getDataFetcher(chainId: ParachainId): DataFetcher | undefined {
  if (!SUPPORTED_CHAINS.includes(chainId))
    return undefined
  return DATAFETCHER_MAP[chainId]
}
