import { ParachainId } from '@zenlink-interface/chain'

interface BlockExplorer {
  name: string
  url: string
}

export interface ParaChain {
  id: ParachainId
  name: string
  network: string
  nativeCurrency: { name: string; symbol: string; decimals: number }
  endpoints: string[]
  blockExplorers?: {
    default: BlockExplorer
  }
}

export const parachains: ParaChain[] = [
  {
    id: ParachainId.BIFROST_KUSAMA,
    name: 'Bifrost Kusama',
    network: 'bifrost kusama',
    nativeCurrency: { name: 'Bifrost', symbol: 'BNC', decimals: 12 },
    endpoints: [
      'wss://us.bifrost-rpc.liebi.com/ws',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://bifrost-kusama.subscan.io',
      },
    },
  },
]
