import 'dotenv/config'

import { ParachainId } from '@zenlink-interface/chain'
import { DataFetcher } from '@zenlink-interface/smart-router'
import type { Chain, PublicClient } from 'viem'
import { createPublicClient, http } from 'viem'
import { astar } from '@zenlink-interface/wagmi-config'

export const SUPPORTED_CHAINS = [
  ParachainId.ASTAR,
]

export function getClient(chainId: ParachainId): PublicClient | undefined {
  switch (chainId) {
    case ParachainId.ASTAR:
      return createPublicClient({
        chain: astar as Chain,
        transport: http(process.env.ASTAR_ENDPOINT_URL),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    default:
      return undefined
  }
}

export function getDataFetcher(chainId: ParachainId): DataFetcher | undefined {
  switch (chainId) {
    case ParachainId.ASTAR: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.ASTAR, client)
    }
    default:
      return undefined
  }
}
