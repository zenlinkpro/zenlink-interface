import { EthereumChainId } from '@zenlink-interface/chain'

export const otherChains = [
  {
    id: EthereumChainId.MOONBEAM,
    name: 'Moonbeam',
    network: 'moonbeam',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.api.moonbeam.network',
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 609002,
    },
  },
  {
    id: EthereumChainId.MOONRIVER,
    name: 'Moonriver',
    network: 'moonriver',
    nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.api.moonriver.moonbeam.network',
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1597904,
    },
  },
  {
    id: EthereumChainId.ASTAR,
    name: 'Astar',
    network: 'astar',
    nativeCurrency: { name: 'Astar', symbol: 'ASTR', decimals: 18 },
    rpcUrls: {
      default: 'https://astar.api.onfinality.io/public',
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 761794,
    },
  },
]
