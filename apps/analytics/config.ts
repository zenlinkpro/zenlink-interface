import { ParachainId } from '@zenlink-interface/chain'

export const AMM_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
  ParachainId.BIFROST_KUSAMA,
  ParachainId.DOLPHIN
]

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([...AMM_ENABLED_NETWORKS]),
)
