import { ParachainId } from '@zenlink-interface/chain'
import type { Chain } from '@wagmi/core'
import { configureChains, createClient } from '@wagmi/core'
import { otherChains } from '@zenlink-interface/wagmi-config'
import { publicProvider } from '@wagmi/core/providers/public'

export const EVM_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
]

export const SUBSTRATE_CHAINS = [
  ParachainId.BIFROST_KUSAMA,
]

export const ZENLINK_CHAINS = [
  ...EVM_CHAINS,
  ...SUBSTRATE_CHAINS,
]

export const SUBSCAN_ENDPOINTS = {
  [ParachainId.BIFROST_KUSAMA]: 'https://bifrost-kusama.api.subscan.io',
  [ParachainId.ASTAR]: 'https://astar.api.subscan.io',
  [ParachainId.MOONRIVER]: 'https://moonriver.api.subscan.io',
  [ParachainId.MOONBEAM]: 'https://moonbeam.api.subscan.io',
}

export const WS_ENDPOINTS = {
  [ParachainId.BIFROST_KUSAMA]: ['wss://bifrost-parachain.api.onfinality.io/public-ws'],
}

export const RPC_ENDPOINTS = {
  [ParachainId.ASTAR]: ['https://astar.api.onfinality.io/public'],
  [ParachainId.MOONBEAM]: ['https://moonriver.api.onfinality.io/public'],
  [ParachainId.MOONRIVER]: ['https://moonbeam.api.onfinality.io/public'],
}
export const ZLK_EVM_ADDRESSES = {
  [ParachainId.BIFROST_KUSAMA]: '',
  [ParachainId.ASTAR]: '0x998082c488e548820f970df5173bd2061ce90635',
  [ParachainId.MOONRIVER]: '0x0f47ba9d9bde3442b42175e51d6a367928a1173b',
  [ParachainId.MOONBEAM]: '0x3fd9b6c9a24e09f67b7b706d72864aebb439100c',
}

export const SYSTEM_ZLK_HOLDERS = {
  [ParachainId.BIFROST_KUSAMA]: ['cRzg4nyCBKbCZaCYmNQksWGMJuectrHom15ZiuYd7h6NtvW'],
  [ParachainId.ASTAR]: [
    '0xA7b23D35e2697B84EED22cDef13bC7878dB884cA',
    '0x2FAA24DC69D8dFd8EA169b244cA257eA4e67d500',
    '0x841ce48F9446C8E281D3F1444cB859b4A6D0738C',
    '0x0000000000000000000000000000000000000000',
    '0x000000000000000000000000000000000000dead',
  ],
  [ParachainId.MOONRIVER]: [
    '0xe1e76edb74cca82cea5ae2512f024466818dc6c6',
    '0xecf2adaff1de8a512f6e8bfe67a2c836edb25da3',
    '0xd858BfE93b43dAF6c3B873B32fa549fBB58fC24b',
    '0xE10c59f10d7287b0f1a757dafd557323187B6bb7',
    '0x646b7b556AeAF500087A460f2Fe6E4b54Ce74E1A',
    '0x000000000000000000000000000000000000dead',
  ],
  [ParachainId.MOONBEAM]: [
    '0xe1E76Edb74CcA82ceA5aE2512F024466818Dc6c6',
    '0x965f84d915a9efa2dd81b653e3ae736555d945f4',
    '0xb25427A9E15358586dd8003A1FE730C8f185734e',
    '0x4cC71E2563Bd8FDf9Fa5D3b7500adaA2332FeE57',
    '0x841ce48F9446C8E281D3F1444cB859b4A6D0738C',
    '0x0000000000000000000000000000000000000000',
    '0x000000000000000000000000000000000000dead',
  ],

}

export const ZLK_DEAD_ADDRESSES = {
  [ParachainId.BIFROST_KUSAMA]: [''],
  [ParachainId.ASTAR]: [
    '0x000000000000000000000000000000000000dead',
  ],
  [ParachainId.MOONRIVER]: [
    '0x000000000000000000000000000000000000dead',
  ],
  [ParachainId.MOONBEAM]: [
    '0x000000000000000000000000000000000000dead',
  ],

}

const { provider } = configureChains([...otherChains] as Chain[], [publicProvider({ priority: 0 })])
createClient({ provider, autoConnect: true })

if (!process.env.SUBSCAN_API_KEY)
  throw new Error('REDIS_URL is required')

export const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY
