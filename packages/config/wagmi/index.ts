import { EthereumChainId } from '@zenlink-interface/chain'
import type { Chain } from '@wagmi/core/chains'
import { moonbeam, moonriver } from '@wagmi/core/chains'

export const astar: Chain = {
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

export { moonbeam, moonriver }

export const otherChains = [
  moonbeam,
  moonriver,
  astar,
]
