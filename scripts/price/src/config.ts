import { ParachainId } from '@zenlink-interface/chain'

export const ZENLINK_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.BIFROST_KUSAMA,
]

export const UNI_SUPPORTED_CHAINS = [
  ParachainId.ARBITRUM_ONE,
  ParachainId.BASE
]

export const COINGECKO_SUPPORTED_CHAINS = [
  ParachainId.MOONBEAM,
]

export const ALL_CHAINS = Array.from(
  new Set([
    ...ZENLINK_CHAINS, 
    ...UNI_SUPPORTED_CHAINS, 
    ...COINGECKO_SUPPORTED_CHAINS 
  ])
)
