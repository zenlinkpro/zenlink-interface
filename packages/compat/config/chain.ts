import { ParachainId } from '@zenlink-interface/chain'

export const AMM_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
]

export const EVM_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
]

export const SUBSTRATE_NETWORKS = [
  ParachainId.BIFROST_KUSAMA,
]

export const SUPPORTED_CHAIN_IDS = Array.from(new Set([...AMM_ENABLED_NETWORKS]))

export function isEvmNetwork(chainId: ParachainId) {
  return EVM_NETWORKS.includes(chainId)
}

export function isSubstrateNetwork(chainId: ParachainId) {
  return SUBSTRATE_NETWORKS.includes(chainId)
}
