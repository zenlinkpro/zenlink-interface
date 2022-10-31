import { ParachainId } from '@zenlink-interface/chain'
import { addressMapToTokenMap } from './addressMapToTokenMap'
import { Token } from './Token'

export const WNATIVE_ADDRESS: Record<number, string> = {
  [ParachainId.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
  [ParachainId.MOONBEAM]: '0xAcc15dC74880C9944775448304B263D191c6077F',
  [ParachainId.ASTAR]: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
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
