import { ParachainId } from '@zenlink-interface/chain'
import { addressMapToTokenMap } from './addressMapToTokenMap'
import { Token } from './Token'

export const WNATIVE_ADDRESS: Record<number, string> = {
  [ParachainId.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
  [ParachainId.MOONBEAM]: '0xAcc15dC74880C9944775448304B263D191c6077F',
  [ParachainId.ASTAR]: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
  [ParachainId.BIFROST_KUSAMA]: '2001-0-0',
  [ParachainId.BIFROST_POLKADOT]: '2030-0-0',
}

export const WNATIVE: Record<keyof typeof WNATIVE_ADDRESS, Token> = {
  [ParachainId.MOONRIVER]: new Token({
    chainId: ParachainId.MOONRIVER,
    address: WNATIVE_ADDRESS[ParachainId.MOONRIVER],
    decimals: 18,
    symbol: 'WMOVR',
    name: 'Wrapped Moonriver',
  }),
  [ParachainId.MOONBEAM]: new Token({
    chainId: ParachainId.MOONBEAM,
    address: WNATIVE_ADDRESS[ParachainId.MOONBEAM],
    decimals: 18,
    symbol: 'WGLMR',
    name: 'Wrapped Glimmer',
  }),
  [ParachainId.ASTAR]: new Token({
    chainId: ParachainId.ASTAR,
    address: WNATIVE_ADDRESS[ParachainId.ASTAR],
    decimals: 18,
    symbol: 'WASTR',
    name: 'Wrapped Astar',
  }),
  [ParachainId.BIFROST_KUSAMA]: new Token({
    chainId: ParachainId.BIFROST_KUSAMA,
    address: WNATIVE_ADDRESS[ParachainId.BIFROST_KUSAMA],
    decimals: 12,
    symbol: 'BNC',
    name: 'Bifrost',
  }),
  [ParachainId.BIFROST_POLKADOT]: new Token({
    chainId: ParachainId.BIFROST_POLKADOT,
    address: WNATIVE_ADDRESS[ParachainId.BIFROST_POLKADOT],
    decimals: 12,
    symbol: 'BNC',
    name: 'Bifrost',
  }),
}

export const ZLK_ADDRESS = {
  [ParachainId.ASTAR]: '0x998082c488e548820f970df5173bd2061ce90635',
  [ParachainId.MOONRIVER]: '0x0f47ba9d9bde3442b42175e51d6a367928a1173b',
  [ParachainId.MOONBEAM]: '0x3fd9b6c9a24e09f67b7b706d72864aebb439100c',
  [ParachainId.BIFROST_KUSAMA]: '2001-2-519',
  [ParachainId.BIFROST_POLKADOT]: '2030-2-519',
}

export const ZLK = {
  ...(addressMapToTokenMap(
    {
      decimals: 18,
      symbol: 'ZLK',
      name: 'Zenlink Network Token',
    },
    ZLK_ADDRESS,
  )) as Record<keyof typeof ZLK_ADDRESS, Token>,
}

export const USDC_ADDRESS = {
  [ParachainId.MOONRIVER]: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
  [ParachainId.MOONBEAM]: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  [ParachainId.ASTAR]: '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98',
}

export const USDC: Record<keyof typeof USDC_ADDRESS, Token> = {
  ...(addressMapToTokenMap(
    {
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    },
    USDC_ADDRESS,
  )) as Record<keyof typeof USDC_ADDRESS, Token>,
}

export const USDT_ADDRESS = {
  [ParachainId.MOONRIVER]: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
  [ParachainId.MOONBEAM]: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
  [ParachainId.ASTAR]: '0xffffffff000000000000000000000001000007c0',
  [ParachainId.BIFROST_KUSAMA]: '2001-2-2048',
}

export const USDT = addressMapToTokenMap(
  {
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  },
  USDT_ADDRESS,
)

export const DAI_ADDRESS = {
  [ParachainId.ASTAR]: '0x6De33698e9e9b787e09d3Bd7771ef63557E148bb',
}

export const DAI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },
  DAI_ADDRESS,
)

export const FRAX_ADDRESS = {
  [ParachainId.MOONRIVER]: '0x1A93B23281CC1CDE4C4741353F3064709A16197d',
  [ParachainId.MOONBEAM]: '0x322E86852e492a7Ee17f28a78c663da38FB33bfb',
}

export const FRAX = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'FRAX',
    name: 'Frax',
  },
  FRAX_ADDRESS,
)

export const XCAUSD_ADDRESS = {
  [ParachainId.MOONRIVER]: '0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228',
  [ParachainId.MOONBEAM]: '0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda',
  [ParachainId.BIFROST_KUSAMA]: '2001-2-770',
}

export const XCAUSD = addressMapToTokenMap(
  {
    decimals: 12,
    symbol: 'xcaUSD',
    name: 'Acala Dollar',
  },
  XCAUSD_ADDRESS,
)

export const KSM_ADDRESS = {
  [ParachainId.BIFROST_KUSAMA]: '2001-2-516',
}

export const KSM = addressMapToTokenMap(
  {
    decimals: 12,
    symbol: 'KSM',
    name: 'Kusama',
  },
  KSM_ADDRESS,
)

export const DOT_ADDRESS = {
  [ParachainId.ASTAR]: '0xffffffffffffffffffffffffffffffffffffffff',
  [ParachainId.BIFROST_POLKADOT]: '2030-2-2048',
}

export const DOT = addressMapToTokenMap(
  {
    decimals: 10,
    symbol: 'DOT',
    name: 'Polkadot',
  },
  DOT_ADDRESS,
)
