import { ParachainId } from '@zenlink-interface/chain'

export const AMM_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
  ParachainId.BIFROST_KUSAMA,
  ParachainId.BIFROST_POLKADOT,
]

export const ZLK_DISCOUNT_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
]

export const REFERRALS_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.ARBITRUM_ONE,
]

export const SUPPORTED_CHAIN_IDS = Array.from(new Set([
  ...AMM_ENABLED_NETWORKS,
  ...REFERRALS_ENABLED_NETWORKS,
]))
