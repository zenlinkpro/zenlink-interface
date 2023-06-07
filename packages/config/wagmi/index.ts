import { EthereumChainId } from '@zenlink-interface/chain'

export const astar = {
  id: EthereumChainId.ASTAR,
  name: 'Astar',
  network: 'astar',
  nativeCurrency: { name: 'Astar', symbol: 'ASTR', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://astar.public.blastapi.io',
        'https://astar.api.onfinality.io/public',
      ],
    },
    public: {
      http: [
        'https://astar.public.blastapi.io',
        'https://astar.api.onfinality.io/public',
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Astarscan',
      url: 'https://blockscout.com/astar',
    },
    default: {
      name: 'Astarscan',
      url: 'https://blockscout.com/astar',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 761794,
    },
  },
} as const

export const moonbeam = {
  id: EthereumChainId.MOONBEAM,
  name: 'Moonbeam',
  network: 'moonbeam',
  nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.api.moonbeam.network',
      ],
    },
    public: {
      http: [
        'https://rpc.api.moonbeam.network',
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Moonscan',
      url: 'https://moonbeam.moonscan.io',
    },
    default: {
      name: 'Moonscan',
      url: 'https://moonbeam.moonscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 609002,
    },
  },
} as const

export const moonriver = {
  id: EthereumChainId.MOONRIVER,
  name: 'Moonriver',
  network: 'moonriver',
  nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.api.moonriver.moonbeam.network',
      ],
    },
    public: {
      http: [
        'https://rpc.api.moonriver.moonbeam.network',
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Moonscan',
      url: 'https://moonriver.moonscan.io',
    },
    default: {
      name: 'Moonscan',
      url: 'https://moonriver.moonscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1597904,
    },
  },
} as const

export const arbitrum = {
  id: 42161,
  name: 'Arbitrum One',
  network: 'arbitrum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://arb-mainnet.g.alchemy.com/v2'],
      webSocket: ['wss://arb-mainnet.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://arbitrum-mainnet.infura.io/v3'],
      webSocket: ['wss://arbitrum-mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    etherscan: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
}

export const otherChains = [
  moonbeam,
  moonriver,
  astar,
  arbitrum,
]
