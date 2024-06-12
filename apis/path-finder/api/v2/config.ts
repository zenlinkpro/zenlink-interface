import 'dotenv/config'

import { EthereumChainId, ParachainId } from '@zenlink-interface/chain'
import { DataFetcher } from '@zenlink-interface/smart-router'
import { astar, scroll } from '@zenlink-interface/wagmi-config'
import type { Chain, PublicClient } from 'viem'
import { createPublicClient, fallback, http } from 'viem'
import { base, moonbeam, scrollTestnet } from 'viem/chains'

export const MAX_REQUESTS_PER_MIN = 10

export const CHAINS = [
  ParachainId.MOONBEAM,
  ParachainId.SCROLL_ALPHA,
  ParachainId.SCROLL,
  ParachainId.BASE,
  ParachainId.ASTAR,
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
    case ParachainId.SCROLL_ALPHA:
      return createPublicClient({
        chain: {
          ...scrollTestnet,
          contracts: {
            multicall3: {
              address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            },
          },
        },
        transport: fallback([
          http(process.env.SCROLL_TESTNET_ENDPOINT_URL),
          http(scrollTestnet.rpcUrls.default.http[0]),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.SCROLL:
      return createPublicClient({
        chain: scroll as Chain,
        transport: fallback([
          http(process.env.SCROLL_ENDPOINT_URL),
          http(scroll.rpcUrls.default.http[0]),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.BASE:
      return createPublicClient({
        chain: base as Chain,
        transport: fallback([
          http(process.env.BASE_ENDPOINT_URL),
          http(base.rpcUrls.default.http[0]),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.ASTAR:
      return createPublicClient({
        chain: astar,
        transport: fallback([
          http(process.env.ASTAR_ENDPOINT_URL),
          http(astar.rpcUrls.default.http[0]),
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
    case ParachainId.SCROLL_ALPHA: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.SCROLL_ALPHA, client)
    }
    case ParachainId.SCROLL: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.SCROLL, client)
    }
    case ParachainId.BASE: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.BASE, client)
    }
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
