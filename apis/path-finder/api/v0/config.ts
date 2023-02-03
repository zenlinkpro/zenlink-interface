import 'dotenv/config'

import { ParachainId } from '@zenlink-interface/chain'
import { providers } from 'ethers'
import { DataFetcher } from '@zenlink-interface/smart-router'

export const SUPPORTED_CHAINS = [
  ParachainId.ASTAR,
]

export function getDataFetcher(chainId: ParachainId): DataFetcher | undefined {
  switch (chainId) {
    case ParachainId.ASTAR:
      return new DataFetcher(
        new providers.JsonRpcProvider(process.env.ASTAR_ENDPOINT_URL, 592),
        ParachainId.ASTAR,
      )
    default:
      return undefined
  }
}
