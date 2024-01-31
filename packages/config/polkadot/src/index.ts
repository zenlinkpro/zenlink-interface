import { ParachainId } from '@zenlink-interface/chain'
import {
  rpc as bifrostRpc,
  typesAlias as bifrostTypeAlias,
  types as bifrostTypes,
  typesBundle as bifrostTypesBundle,
} from '@zenlink-types/bifrost'
import {
  rpc as amplitudeRpc,
  typesAlias as amplitudeTypeAlias,
  types as amplitudeTypes,
  typesBundle as amplitudeTypesBundle,
} from '@pendulum-chain/types'
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
    id: ParachainId.BIFROST_POLKADOT,
    name: 'Bifrost Polkadot',
    network: 'bifrost polkadot',
    nativeCurrency: { name: 'Bifrost', symbol: 'BNC', decimals: 12 },
    endpoints: [
      'wss://hk.p.bifrost-rpc.liebi.com/ws',
      'wss://bifrost-polkadot.api.onfinality.io/public-ws',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://bifrost.subscan.io',
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
    id: ParachainId.AMPLITUDE,
    name: 'Amplitude',
    network: 'amplitude',
    nativeCurrency: { name: 'Amplitude', symbol: 'AMPE', decimals: 12 },
    endpoints: [
      'wss://rpc-amplitude.pendulumchain.tech',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://kusama.subscan.io/parachain/2124',
      },
    },
    apiOptions: {
      rpc: amplitudeRpc,
      types: amplitudeTypes,
      typesAlias: amplitudeTypeAlias,
      typesBundle: amplitudeTypesBundle,
    },
  },
  {
    id: ParachainId.PENDULUM,
    name: 'Pendulum',
    network: 'pendulum',
    nativeCurrency: { name: 'Pendulum', symbol: 'PEN', decimals: 12 },
    endpoints: [
      'wss://pendulum-rpc.dwellir.com',
    ],
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://kusama.subscan.io/parachain/2094',
      },
    },
    apiOptions: {
      rpc: amplitudeRpc,
      types: amplitudeTypes,
      typesAlias: amplitudeTypeAlias,
      typesBundle: amplitudeTypesBundle,
    },
  },

]
