import { ParachainId } from '@zenlink-interface/chain'
import {
  rpc as bifrostRpc,
  typesAlias as bifrostTypeAlias,
  types as bifrostTypes,
  typesBundle as bifrostTypesBundle,
} from '@zenlink-types/bifrost'
import {
  rpc as mantaRpc,
  typesAlias as mantaTypeAlias,
  types as mantaTypes,
  typesBundle as mantaTypesBundle,
} from '@manta-network/types'
import type { ApiOptions } from '@polkadot/api/types'

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
  apiOptions?: ApiOptions
}

export const parachains: ParaChain[] = [
  {
    id: ParachainId.BIFROST_KUSAMA,
    name: 'Bifrost Kusama',
    network: 'bifrost kusama',
    nativeCurrency: { name: 'Bifrost', symbol: 'BNC', decimals: 12 },
    endpoints: [
      'wss://bifrost-rpc.liebi.com/ws',
      'wss://bifrost-parachain.api.onfinality.io/public-ws',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://bifrost-kusama.subscan.io',
      },
    },
    apiOptions: {
      rpc: bifrostRpc,
      types: bifrostTypes,
      typesAlias: bifrostTypeAlias,
      typesBundle: bifrostTypesBundle,
    },
  },
  {
    id: ParachainId.DOLPHIN,
    name: 'Dolphin',
    network: 'dolphin',
    nativeCurrency: { name: 'Dolphin', symbol: 'DOL', decimals: 18 },
    endpoints: [
      'ws://127.0.0.1:9944',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://dolphin.subscan.io',
      },
    },
    apiOptions: {
      rpc: mantaRpc,
      types: mantaTypes,
      typesAlias: mantaTypeAlias,
      typesBundle: mantaTypesBundle,
    },
  },
]
