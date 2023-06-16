import { ParachainId } from '@zenlink-interface/chain'
import flatMap from 'lodash.flatmap'

import { DAI, DOT, FRAX, KSM, USDC, USDT, WNATIVE, XCAUSD, ZLK } from './constants'
import { Token } from './Token'
import type { Type } from './Type'

export const BASES_TO_CHECK_TRADES_AGAINST: { readonly [chainId: number]: Token[] } = {
  // [ParachainId.MOONRIVER]: [
  //   WNATIVE[ParachainId.MOONRIVER],
  //   USDC[ParachainId.MOONRIVER],
  //   FRAX[ParachainId.MOONRIVER],
  //   XCAUSD[ParachainId.MOONRIVER],
  //   USDT[ParachainId.MOONRIVER],
  //   ZLK[ParachainId.MOONRIVER],
  // ],
  // [ParachainId.MOONBEAM]: [
  //   WNATIVE[ParachainId.MOONBEAM],
  //   USDC[ParachainId.MOONBEAM],
  //   FRAX[ParachainId.MOONBEAM],
  //   XCAUSD[ParachainId.MOONBEAM],
  //   USDT[ParachainId.MOONBEAM],
  //   ZLK[ParachainId.MOONBEAM],
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0xc234a67a4f840e61ade794be47de455361b52413',
  //     decimals: 18,
  //     symbol: 'madDAI',
  //     name: 'Dai Stablecoin',
  //   }),
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9',
  //     decimals: 6,
  //     symbol: 'madUSDC',
  //     name: 'USD Coin',
  //   }),
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0x8e70cd5b4ff3f62659049e74b6649c6603a0e594',
  //     decimals: 6,
  //     symbol: 'madUSDT',
  //     name: 'Tether USD',
  //   }),
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0x81ecac0d6be0550a00ff064a4f9dd2400585fe9c',
  //     decimals: 6,
  //     symbol: 'ceUSDT',
  //     name: 'Tether USD (Celer)',
  //   }),
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0x6a2d262d56735dba19dd70682b39f6be9a931d98',
  //     decimals: 6,
  //     symbol: 'ceUSDC',
  //     name: 'USD Coin (Celer)',
  //   }),
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
  //     decimals: 18,
  //     symbol: 'anyBUSD',
  //     name: 'Binance-Peg BUSD Token',
  //   }),
  //   new Token({
  //     chainId: ParachainId.MOONBEAM,
  //     address: '0x765277eebeca2e31912c9946eae1021199b39c61',
  //     decimals: 18,
  //     symbol: 'anyDAI',
  //     name: 'Dai Stablecoin',
  //   }),
  // ],
  // [ParachainId.ASTAR]: [
  //   WNATIVE[ParachainId.ASTAR],
  //   USDC[ParachainId.ASTAR],
  //   DAI[ParachainId.ASTAR],
  //   USDT[ParachainId.ASTAR],
  //   DOT[ParachainId.ASTAR],
  //   ZLK[ParachainId.ASTAR],
  //   new Token({
  //     chainId: ParachainId.ASTAR,
  //     address: '0x4Bf769b05E832FCdc9053fFFBC78Ca889aCb5E1E',
  //     decimals: 18,
  //     symbol: 'BUSD',
  //     name: 'Binance USD',
  //   }),
  //   new Token({
  //     chainId: ParachainId.ASTAR,
  //     address: '0x733ebcC6DF85f8266349DEFD0980f8Ced9B45f35',
  //     decimals: 18,
  //     symbol: 'BAI',
  //     name: 'BAI Stablecoin',
  //   }),
  // ],
  // [ParachainId.BIFROST_KUSAMA]: [
  //   WNATIVE[ParachainId.BIFROST_KUSAMA],
  //   USDT[ParachainId.BIFROST_KUSAMA],
  //   XCAUSD[ParachainId.BIFROST_KUSAMA],
  //   KSM[ParachainId.BIFROST_KUSAMA],
  //   ZLK[ParachainId.BIFROST_KUSAMA],
  // ],
  // [ParachainId.BIFROST_POLKADOT]: [
  //   WNATIVE[ParachainId.BIFROST_POLKADOT],
  //   DOT[ParachainId.BIFROST_POLKADOT],
  //   new Token({
  //     chainId: ParachainId.BIFROST_POLKADOT,
  //     address: '2030-2-2304',
  //     decimals: 10,
  //     symbol: 'vDOT',
  //     name: 'Voucher DOT',
  //   }),
  //   new Token({
  //     chainId: ParachainId.BIFROST_POLKADOT,
  //     address: '2030-2-2560',
  //     decimals: 10,
  //     symbol: 'vsDOT',
  //     name: 'Voucher Slot DOT',
  //   }),
  // ],
  [ParachainId.CALAMARI_KUSAMA]: [
    WNATIVE[ParachainId.CALAMARI_KUSAMA],
  ],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  // [ParachainId.MOONRIVER]: {
  //   '0x3b25BC1dC591D24d60560d0135D6750A561D4764': [
  //     new Token({
  //       chainId: ParachainId.MOONRIVER,
  //       address: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
  //       decimals: 18,
  //       symbol: 'ETH',
  //       name: 'BAI Ethereum',
  //     }),
  //   ],
  //   '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C': [
  //     new Token({
  //       chainId: ParachainId.MOONRIVER,
  //       address: '0x3b25BC1dC591D24d60560d0135D6750A561D4764',
  //       decimals: 18,
  //       symbol: 'vETH',
  //       name: 'Voucher Ethereum',
  //     }),
  //   ],
  // },
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
