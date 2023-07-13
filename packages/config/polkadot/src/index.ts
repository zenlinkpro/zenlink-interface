import { ParachainId } from '@zenlink-interface/chain'

import type { ApiOptions } from '@polkadot/api/types'

import rpc from './config/rpc.json'
import types from './config/types.json'

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
  // {
  //   id: ParachainId.BIFROST_KUSAMA,
  //   name: 'Bifrost Kusama',
  //   network: 'bifrost kusama',
  //   nativeCurrency: { name: 'Bifrost', symbol: 'BNC', decimals: 12 },
  //   endpoints: [
  //     'wss://bifrost-rpc.liebi.com/ws',
  //     'wss://bifrost-parachain.api.onfinality.io/public-ws',
  //   ],
  //   blockExplorers: {
  //     default: {
  //       name: 'subscan',
  //       url: 'https://bifrost-kusama.subscan.io',
  //     },
  //   },
  //   apiOptions: {
  //     rpc: bifrostRpc,
  //     types: bifrostTypes,
  //     typesAlias: bifrostTypeAlias,
  //     typesBundle: bifrostTypesBundle,
  //   },
  // },
  // {
  //   id: ParachainId.BIFROST_POLKADOT,
  //   name: 'Bifrost Polkadot',
  //   network: 'bifrost polkadot',
  //   nativeCurrency: { name: 'Bifrost', symbol: 'BNC', decimals: 12 },
  //   endpoints: [
  //     'wss://hk.p.bifrost-rpc.liebi.com/ws',
  //     'wss://bifrost-polkadot.api.onfinality.io/public-ws',
  //   ],
  //   blockExplorers: {
  //     default: {
  //       name: 'subscan',
  //       url: 'https://bifrost.subscan.io',
  //     },
  //   },
  //   apiOptions: {
  //     rpc: bifrostRpc,
  //     types: bifrostTypes,
  //     typesAlias: bifrostTypeAlias,
  //     typesBundle: bifrostTypesBundle,
  //   },
  // },
  {
    id: ParachainId.CALAMARI_KUSAMA,
    name: 'Calamari Network',
    network: 'calamari kusama',
    nativeCurrency: { name: 'Calamari', symbol: 'KMA', decimals: 12 },
    endpoints: [
      'wss://zenlink.zqhxuyuan.cloud:444',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://calamari.subscan.io',
      },
    },
    apiOptions: {
      rpc,
      types,
    },
  },
  {
    id: ParachainId.MANTA_STAGING,
    name: 'Manta Staging',
    network: 'manta staging',
    nativeCurrency: { name: 'Manta', symbol: 'MANTA', decimals: 18 },
    endpoints: [
      'wss://c1.baikal.testnet.manta.systems',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://manta.subscan.io',
      },
    },
    apiOptions: {
      rpc,
      types,
    },
  },
  // {
  //   id: ParachainId.MANTA_POLKADOT,
  //   name: 'Manta Polkadot',
  //   network: 'manta polkadot',
  //   nativeCurrency: { name: 'Manta', symbol: 'MANTA', decimals: 18 },
  //   endpoints: [
  //     'wss://manta.seabird.systems',
  //   ],
  //   blockExplorers: {
  //     default: {
  //       name: 'subscan',
  //       url: 'https://manta.subscan.io',
  //     },
  //   },
  //   apiOptions: {
  //     rpc: bifrostRpc,
  //     types: bifrostTypes,
  //     typesAlias: bifrostTypeAlias,
  //     typesBundle: bifrostTypesBundle,
  //   },
  // },
]
