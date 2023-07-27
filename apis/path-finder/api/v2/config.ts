import 'dotenv/config'

import { EthereumChainId, ParachainId } from '@zenlink-interface/chain'
import { DataFetcher } from '@zenlink-interface/smart-router'
import type { PublicClient } from 'viem'
import { createPublicClient, fallback, http } from 'viem'
import { moonbeam } from 'viem/chains'

export const CHAINS = [
  ParachainId.MOONBEAM,
]

export const SUPPORTED_CHAINS = Array.from(
  new Set([...CHAINS]),
)

export function getClient(chainId: ParachainId): PublicClient | undefined {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return createPublicClient({
        chain: moonbeam,
        transport: fallback([
          http(process.env.MOONBEAM_ENDPOINT_URL),
          http('https://moonbeam.public.blastapi.io'),
        ]),
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
    case ParachainId.MOONBEAM: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.MOONBEAM, client)
    }
    default:
      return undefined
  }
}

export function convertChainId(chainId: EthereumChainId | ParachainId): ParachainId {
  switch (chainId) {
    case EthereumChainId.MOONBEAM:
      return ParachainId.MOONBEAM
    case EthereumChainId.ASTAR:
      return ParachainId.ASTAR
    default:
      return chainId as ParachainId
  }
}
