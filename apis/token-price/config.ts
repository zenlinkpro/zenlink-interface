import { ParachainId } from '@zenlink-interface/chain'

export const AMM_SUPPORTED_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.BIFROST_KUSAMA,
  ParachainId.BIFROST_POLKADOT,
]

export const UNI_SUPPORTED_CHAINS = [
  ParachainId.ARBITRUM_ONE,
  ParachainId.BASE,
]

export const COINGECKO_SUPPORTED_CHAINS = [
  ParachainId.MOONBEAM,
]

export const ALL_CHAINS = Array.from(
  new Set([
    ...AMM_SUPPORTED_CHAINS, 
    ...UNI_SUPPORTED_CHAINS, 
    ...COINGECKO_SUPPORTED_CHAINS 
  ])
)
