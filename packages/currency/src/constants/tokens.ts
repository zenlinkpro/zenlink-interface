import { ParachainId } from '@zenlink-interface/chain'
import { addressMapToTokenMap } from '../addressMapToTokenMap'
import { Token } from '../Token'
import {
  ARB_ADDRESS,
  cbBTC_ADDRESS,
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
  [ParachainId.ARBITRUM_ONE]: new Token({
    chainId: ParachainId.ARBITRUM_ONE,
    address: WNATIVE_ADDRESS[ParachainId.ARBITRUM_ONE],
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
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
  [ParachainId.SCROLL_ALPHA]: new Token({
    chainId: ParachainId.SCROLL_ALPHA,
    address: WNATIVE_ADDRESS[ParachainId.SCROLL_ALPHA],
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
  }),
  [ParachainId.SCROLL]: new Token({
    chainId: ParachainId.SCROLL,
    address: WNATIVE_ADDRESS[ParachainId.SCROLL],
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
  }),
  [ParachainId.BASE]: new Token({
    chainId: ParachainId.BASE,
    address: WNATIVE_ADDRESS[ParachainId.BASE],
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
  }),
  [ParachainId.AMPLITUDE]: new Token({
    chainId: ParachainId.AMPLITUDE,
    address: WNATIVE_ADDRESS[ParachainId.AMPLITUDE],
    decimals: 12,
    name: 'Amplitude',
    symbol: 'AMPE',
  }),
  [ParachainId.PENDULUM]: new Token({
    chainId: ParachainId.PENDULUM,
    address: WNATIVE_ADDRESS[ParachainId.PENDULUM],
    decimals: 12,
    name: 'Pendulum',
    symbol: 'PEN',
  }),
}

export const WETH9: Record<keyof typeof WETH9_ADDRESS, Token> = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  },
  WETH9_ADDRESS,
)

export const WBTC: Record<keyof typeof WBTC_ADDRESS, Token> = addressMapToTokenMap(
  {
    decimals: 8,
    symbol: 'WBTC',
    name: 'Wrapped BTC',
  },
  WBTC_ADDRESS,
)

export const cbBTC: Record<keyof typeof cbBTC_ADDRESS, Token> = addressMapToTokenMap(
  {
    decimals: 8,
    symbol: 'cbBTC',
    name: 'Coinbase Wrapped BTC',
  },
  cbBTC_ADDRESS,
)

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
  [ParachainId.MOONBEAM]: new Token({
    chainId: ParachainId.MOONBEAM,
    address: '0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D',
    decimals: 6,
    symbol: 'xcUSDC',
    name: 'USD Coin (Xcm)',
  }),
} as { [k: string]: Token }

export const USDT = {
  ...addressMapToTokenMap(
    {
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD',
    },
    USDT_ADDRESS,
  ),
  [ParachainId.MOONBEAM]: new Token({
    chainId: ParachainId.MOONBEAM,
    address: '0xffffffffea09fb06d082fd1275cd48b191cbcd1d',
    decimals: 6,
    symbol: 'xcUSDT',
    name: 'Tether USD (Xcm)',
  }),
  [ParachainId.SCROLL_ALPHA]: new Token({
    chainId: ParachainId.SCROLL_ALPHA,
    address: '0x63fEF8791bdbe25A77337Cc265Ad732f200450AF',
    decimals: 18,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
} as { [k: string]: Token }

export const DAI = {
  ...addressMapToTokenMap(
    {
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    },
    DAI_ADDRESS,
  ),
} as { [k: string]: Token }

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
