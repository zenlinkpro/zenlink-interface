import { ParachainId } from '@zenlink-interface/chain'
import { DAI, DOT, Token, USDC, USDT, WNATIVE } from '@zenlink-interface/currency'

export const BASES_TO_CHECK_TRADES_AGAINST: { readonly [chainId: number]: Token[] } = {
  [ParachainId.ASTAR]: [
    WNATIVE[ParachainId.ASTAR],
    USDC[ParachainId.ASTAR],
    DAI[ParachainId.ASTAR],
    USDT[ParachainId.ASTAR],
    DOT[ParachainId.ASTAR],
    new Token({
      chainId: ParachainId.ASTAR,
      address: '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283',
      decimals: 6,
      symbol: 'ceUSDT',
      name: 'Tether USD (Celer)',
    }),
    new Token({
      chainId: ParachainId.ASTAR,
      address: '0x4Bf769b05E832FCdc9053fFFBC78Ca889aCb5E1E',
      decimals: 18,
      symbol: 'BUSD',
      name: 'Binance USD',
    }),
    new Token({
      chainId: ParachainId.ASTAR,
      address: '0x733ebcC6DF85f8266349DEFD0980f8Ced9B45f35',
      decimals: 18,
      symbol: 'BAI',
      name: 'BAI Stablecoin',
    }),
  ],
}

export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {

}
