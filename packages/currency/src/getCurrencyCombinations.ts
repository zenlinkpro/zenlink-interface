import { ParachainId } from '@zenlink-interface/chain'
import flatMap from 'lodash.flatmap'

import { DAI, FRAX, USDC, USDT, WNATIVE, XCAUSD } from './constants'
import { Token } from './Token'
import type { Type } from './Type'

export const BASES_TO_CHECK_TRADES_AGAINST: { readonly [chainId: number]: Token[] } = {
  [ParachainId.MOONRIVER]: [
    WNATIVE[ParachainId.MOONRIVER],
    USDC[ParachainId.MOONRIVER],
    FRAX[ParachainId.MOONRIVER],
    XCAUSD[ParachainId.MOONRIVER],
    USDT[ParachainId.MOONRIVER],
  ],
  [ParachainId.MOONBEAM]: [
    WNATIVE[ParachainId.MOONBEAM],
    USDC[ParachainId.MOONBEAM],
    FRAX[ParachainId.MOONBEAM],
    XCAUSD[ParachainId.MOONBEAM],
    USDT[ParachainId.MOONBEAM],
  ],
  [ParachainId.ASTAR]: [
    WNATIVE[ParachainId.ASTAR],
    USDC[ParachainId.ASTAR],
    DAI[ParachainId.ASTAR],
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

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ParachainId.MOONRIVER]: {
    '0x3b25BC1dC591D24d60560d0135D6750A561D4764': [
      new Token({
        chainId: ParachainId.MOONRIVER,
        address: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
        decimals: 18,
        symbol: 'ETH',
        name: 'BAI Ethereum',
      }),
    ],
    '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C': [
      new Token({
        chainId: ParachainId.MOONRIVER,
        address: '0x3b25BC1dC591D24d60560d0135D6750A561D4764',
        decimals: 18,
        symbol: 'vETH',
        name: 'Voucher Ethereum',
      }),
    ],
  },
}

export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {}

export function getCurrencyCombinations(chainId: number, currencyA: Type, currencyB: Type) {
  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

  const common = chainId in BASES_TO_CHECK_TRADES_AGAINST ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []
  const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
  const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

  const bases: Token[] = [...common, ...additionalA, ...additionalB]

  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map(otherBase => [base, otherBase]),
  )

  if (!tokenA || !tokenB)
    return []

  const cacheMap: Record<string, boolean> = {}

  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base): [Token, Token] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Token, Token] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
    .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
    .filter(([t0, t1]) => t0.address !== t1.address && t0.chainId === t1.chainId)
    .filter(([tokenA, tokenB]) => {
      const cacheKey = tokenA.sortsBefore(tokenB)
        ? `${tokenA.address}${tokenB.address}`
        : `${tokenB.address}${tokenA.address}`
      if (cacheMap[cacheKey])
        return false
      return cacheMap[cacheKey] = true
    })
    .filter(([tokenA, tokenB]) => {
      if (!chainId)
        return true
      const customBases = CUSTOM_BASES[chainId]

      const customBasesA: Token[] | undefined = customBases?.[tokenA.address]
      const customBasesB: Token[] | undefined = customBases?.[tokenB.address]

      if (!customBasesA && !customBasesB)
        return true

      if (customBasesA && !customBasesA.find(base => tokenB.equals(base)))
        return false
      if (customBasesB && !customBasesB.find(base => tokenA.equals(base)))
        return false

      return true
    })
}
