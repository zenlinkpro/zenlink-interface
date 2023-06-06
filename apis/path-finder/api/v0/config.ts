import 'dotenv/config'

import { ParachainId } from '@zenlink-interface/chain'
import { DataFetcher } from '@zenlink-interface/smart-router'
import type { Chain, PublicClient } from 'viem'
import { createPublicClient, fallback, http } from 'viem'
import { arbitrum, astar } from '@zenlink-interface/wagmi-config'

export const V1_CHAINS = [
  ParachainId.ASTAR,
]

export const V2_CHAINS = [
  ParachainId.ARBITRUM_ONE,
]

export const SUPPORTED_CHAINS = Array.from(
  new Set([
    ...V1_CHAINS,
    ...V2_CHAINS,
  ]),
)

export function getClient(chainId: ParachainId): PublicClient | undefined {
  switch (chainId) {
    case ParachainId.ASTAR:
      return createPublicClient({
        chain: astar as Chain,
        transport: fallback([
          http(process.env.ASTAR_ENDPOINT_URL),
          http('https://astar.public.blastapi.io'),
          http('https://astar.api.onfinality.io/public'),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.ARBITRUM_ONE:
      return createPublicClient({
        chain: arbitrum as Chain,
        transport: http(process.env.ARBITRUM_ENDPOINT_URL),
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
    case ParachainId.ARBITRUM_ONE: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.ARBITRUM_ONE, client)
    }
    default:
      return undefined
  }
}
