import { ParachainId } from '@zenlink-interface/chain'

export const ZENLINK_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
  ParachainId.BIFROST_KUSAMA,
]

export const UNI_SUPPORTED_CHAINS = [
  ParachainId.ARBITRUM_ONE,
]

export const ALL_CHAINS = Array.from(new Set([...ZENLINK_CHAINS, ...UNI_SUPPORTED_CHAINS]))
