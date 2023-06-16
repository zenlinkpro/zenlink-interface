import { ParachainId } from '@zenlink-interface/chain'
import { Token } from '../Token'
import { addressMapToTokenMap } from '../addressMapToTokenMap'
import {
  ARB_ADDRESS,
  DAI_ADDRESS,
  DOT_ADDRESS,
  FRAX_ADDRESS,
  KSM_ADDRESS,
  LINK_ADDRESS,
  UNI_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WBTC_ADDRESS,
  WETH9_ADDRESS,
  WNATIVE_ADDRESS,
  XCAUSD_ADDRESS,
  ZLK_ADDRESS,
} from './tokenAddresses'

export const WNATIVE: Record<keyof typeof WNATIVE_ADDRESS, Token> = {
  // [ParachainId.MOONRIVER]: new Token({
  //   chainId: ParachainId.MOONRIVER,
  //   address: WNATIVE_ADDRESS[ParachainId.MOONRIVER],
  //   decimals: 18,
  //   symbol: 'WMOVR',
  //   name: 'Wrapped Moonriver',
  // }),
  // [ParachainId.MOONBEAM]: new Token({
  //   chainId: ParachainId.MOONBEAM,
  //   address: WNATIVE_ADDRESS[ParachainId.MOONBEAM],
  //   decimals: 18,
  //   symbol: 'WGLMR',
  //   name: 'Wrapped Glimmer',
  // }),
  // [ParachainId.ASTAR]: new Token({
  //   chainId: ParachainId.ASTAR,
  //   address: WNATIVE_ADDRESS[ParachainId.ASTAR],
  //   decimals: 18,
  //   symbol: 'WASTR',
  //   name: 'Wrapped Astar',
  // }),
  // [ParachainId.ARBITRUM_ONE]: new Token({
  //   chainId: ParachainId.ARBITRUM_ONE,
  //   address: WNATIVE_ADDRESS[ParachainId.ARBITRUM_ONE],
  //   decimals: 18,
  //   name: 'Wrapped Ether',
  //   symbol: 'WETH',
  // }),
  // [ParachainId.BIFROST_KUSAMA]: new Token({
  //   chainId: ParachainId.BIFROST_KUSAMA,
  //   address: WNATIVE_ADDRESS[ParachainId.BIFROST_KUSAMA],
  //   decimals: 12,
  //   symbol: 'BNC',
  //   name: 'Bifrost',
  // }),
  // [ParachainId.BIFROST_POLKADOT]: new Token({
  //   chainId: ParachainId.BIFROST_POLKADOT,
  //   address: WNATIVE_ADDRESS[ParachainId.BIFROST_POLKADOT],
  //   decimals: 12,
  //   symbol: 'BNC',
  //   name: 'Bifrost',
  // }),
  [ParachainId.CALAMARI_KUSAMA]: new Token({
    chainId: ParachainId.CALAMARI_KUSAMA,
    address: WNATIVE_ADDRESS[ParachainId.CALAMARI_KUSAMA],
    decimals: 12,
    symbol: 'KMA',
    name: 'Calamari',
  }),
}

export const WETH9 = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  },
  WETH9_ADDRESS,
) as Record<keyof typeof WETH9_ADDRESS, Token>

export const WBTC = addressMapToTokenMap(
  {
    decimals: 8,
    symbol: 'WBTC',
    name: 'Wrapped BTC',
  },
  WBTC_ADDRESS,
) as Record<keyof typeof WBTC_ADDRESS, Token>

export const UNI = addressMapToTokenMap(
  {
    symbol: 'UNI',
    decimals: 18,
    name: 'Uniswap',
  },
  UNI_ADDRESS,
) as Record<keyof typeof UNI_ADDRESS, Token>

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

export const USDC = {
  ...addressMapToTokenMap(
    {
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    },
    USDC_ADDRESS,
  ),
} as { [k: string]: Token }

export const USDT = addressMapToTokenMap(
  {
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  },
  USDT_ADDRESS,
)

export const DAI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },
  DAI_ADDRESS,
)

export const FRAX = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'FRAX',
    name: 'Frax',
  },
  FRAX_ADDRESS,
)

export const XCAUSD = addressMapToTokenMap(
  {
    decimals: 12,
    symbol: 'xcaUSD',
    name: 'Acala Dollar',
  },
  XCAUSD_ADDRESS,
)

export const KSM = addressMapToTokenMap(
  {
    decimals: 12,
    symbol: 'KSM',
    name: 'Kusama',
  },
  KSM_ADDRESS,
)

export const DOT = addressMapToTokenMap(
  {
    decimals: 10,
    symbol: 'DOT',
    name: 'Polkadot',
  },
  DOT_ADDRESS,
)

export const LINK = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'LINK',
    name: 'ChainLink Token',
  },
  LINK_ADDRESS,
) as Record<keyof typeof LINK_ADDRESS, Token>

export const ARB = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'ARB',
    name: 'Arbitrum',
  },
  ARB_ADDRESS,
) as Record<keyof typeof LINK_ADDRESS, Token>
