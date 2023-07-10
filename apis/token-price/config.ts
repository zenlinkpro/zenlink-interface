import { ParachainId } from '@zenlink-interface/chain'

export const AMM_SUPPORTED_CHAINS = [
  // ParachainId.ASTAR,
  // ParachainId.MOONRIVER,
  // ParachainId.MOONBEAM,
  // ParachainId.BIFROST_KUSAMA,
  // ParachainId.BIFROST_POLKADOT,
  ParachainId.CALAMARI_KUSAMA,
  ParachainId.MANTA_STAGING,
]

export const UNI_SUPPORTED_CHAINS: ParachainId[] = [
  // ParachainId.ARBITRUM_ONE,
]

export const ALL_CHAINS = Array.from(new Set([...AMM_SUPPORTED_CHAINS, ...UNI_SUPPORTED_CHAINS]))
