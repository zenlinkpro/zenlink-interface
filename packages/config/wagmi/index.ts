import { EthereumChainId } from '@zenlink-interface/chain'

export const astar = {
  id: EthereumChainId.ASTAR,
  name: 'Astar',
  network: 'astar',
  nativeCurrency: { name: 'Astar', symbol: 'ASTR', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://astar.api.onfinality.io/public',
      ],
    },
    public: {
      http: [
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
}

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
}

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
}

export const otherChains = [
  moonbeam,
  moonriver,
  astar,
]
