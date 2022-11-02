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

export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {}

export function getCurrencyCombinations(chainId: number, currencyA: Type, currencyB: Type) {
  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

  const common = chainId in BASES_TO_CHECK_TRADES_AGAINST ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []

  const bases: Token[] = [...common]

  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map(otherBase => [base, otherBase]),
  )

  if (!tokenA || !tokenB)
    return []

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
    .filter(([t0, t1]) => t0.address !== t1.address)
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
