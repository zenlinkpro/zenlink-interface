import { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { ARB, DAI, DOT, FRAX, Native, Token, USDC, USDT, WBTC, WNATIVE } from '@zenlink-interface/currency'

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
    new Token({
      chainId: ParachainId.ASTAR,
      address: '0xb6df5bafdcdce7aeb49af6172143e1942999ef14',
      decimals: 18,
      symbol: '4SRS',
      name: '4SRS',
    }),
    new Token({
      chainId: ParachainId.ASTAR,
      address: '0xe511ed88575c57767bafb72bfd10775413e3f2b0',
      decimals: 18,
      symbol: 'nASTR',
      name: 'Astar Note',
    }),
  ],
  [ParachainId.ARBITRUM_ONE]: [
    WNATIVE[ParachainId.ARBITRUM_ONE],
    USDC[ParachainId.ARBITRUM_ONE],
    USDT[ParachainId.ARBITRUM_ONE],
    FRAX[ParachainId.ARBITRUM_ONE],
    ARB[ParachainId.ARBITRUM_ONE],
    new Token({
      chainId: ParachainId.ARBITRUM_ONE,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      decimals: 6,
      name: 'USD Coin (Arb1)',
      symbol: 'USDC.e',
    }),
  ],
  [ParachainId.MOONBEAM]: [
    WNATIVE[ParachainId.MOONBEAM],
    FRAX[ParachainId.MOONBEAM],
    USDC[ParachainId.MOONBEAM],
    USDT[ParachainId.MOONBEAM],
    DOT[ParachainId.MOONBEAM],
    new Token({
      chainId: ParachainId.MOONBEAM,
      address: '0xCa01a1D0993565291051daFF390892518ACfAD3A',
      decimals: 6,
      name: 'Axelar Wrapped USDC',
      symbol: 'axlUSDC',
    }),
    new Token({
      chainId: ParachainId.MOONBEAM,
      address: '0xab3f0245b83feb11d15aaffefd7ad465a59817ed',
      decimals: 18,
      name: 'Wrapped Ether (Wormhole)',
      symbol: 'WETH.wh',
    }),
    new Token({
      chainId: ParachainId.MOONBEAM,
      address: '0xe57ebd2d67b462e9926e04a8e33f01cd0d64346d',
      decimals: 8,
      name: 'Wrapped BTC (Wormhole)',
      symbol: 'WBTC.wh',
    }),
    new Token({
      chainId: ParachainId.MOONBEAM,
      address: '0xc806B0600cbAfA0B197562a9F7e3B9856866E9bF',
      decimals: 18,
      name: 'Deuterium',
      symbol: 'd2O',
    }),
  ],
  [ParachainId.SCROLL_ALPHA]: [
    WNATIVE[ParachainId.SCROLL_ALPHA],
    USDC[ParachainId.SCROLL_ALPHA],
    USDT[ParachainId.SCROLL_ALPHA],
  ],
  [ParachainId.BASE]: [
    WNATIVE[ParachainId.BASE],
    USDC[ParachainId.BASE],
    DAI[ParachainId.BASE],
  ],
}

export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {

}

export const COMMON_BASES: { readonly [chainId: number]: Type[] } = {
  [ParachainId.ASTAR]: [
    Native.onChain(ParachainId.ASTAR),
    WNATIVE[ParachainId.ASTAR],
    USDC[ParachainId.ASTAR],
    USDT[ParachainId.ASTAR],
    DOT[ParachainId.ASTAR],
    new Token({
      chainId: ParachainId.ASTAR,
      address: '0xe511ed88575c57767bafb72bfd10775413e3f2b0',
      decimals: 18,
      symbol: 'nASTR',
      name: 'Astar Note',
    }),
  ],
  [ParachainId.ARBITRUM_ONE]: [
    Native.onChain(ParachainId.ARBITRUM_ONE),
    ARB[ParachainId.ARBITRUM_ONE],
    USDC[ParachainId.ARBITRUM_ONE],
    USDT[ParachainId.ARBITRUM_ONE],
    DAI[ParachainId.ARBITRUM_ONE],
    WNATIVE[ParachainId.ARBITRUM_ONE],
    WBTC[ParachainId.ARBITRUM_ONE],
  ],
  [ParachainId.MOONBEAM]: [
    Native.onChain(ParachainId.MOONBEAM),
    USDC[ParachainId.MOONBEAM],
    USDT[ParachainId.MOONBEAM],
    FRAX[ParachainId.MOONBEAM],
    DOT[ParachainId.MOONBEAM],
    WNATIVE[ParachainId.MOONBEAM],
  ],
  [ParachainId.SCROLL_ALPHA]: [
    Native.onChain(ParachainId.SCROLL_ALPHA),
    USDC[ParachainId.SCROLL_ALPHA],
    USDT[ParachainId.SCROLL_ALPHA],
    DAI[ParachainId.SCROLL_ALPHA],
    WNATIVE[ParachainId.SCROLL_ALPHA],
  ],
  [ParachainId.BASE]: [
    Native.onChain(ParachainId.BASE),
    new Token({
      chainId: ParachainId.BASE,
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      decimals: 6,
      symbol: 'USDbc',
      name: 'USD Base Coin',
    }),
    new Token({
      chainId: ParachainId.BASE,
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    }),
    new Token({
      chainId: ParachainId.BASE,
      address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
      decimals: 18,
      symbol: 'cbETH',
      name: 'Coinbase Wrapped Staked ETH',
    }),
    WNATIVE[ParachainId.BASE],
  ],
}
