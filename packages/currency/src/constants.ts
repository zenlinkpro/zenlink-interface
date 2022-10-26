import { ParachainId } from '@zenlink-interface/chain'
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
