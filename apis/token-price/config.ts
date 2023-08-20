import { ParachainId } from '@zenlink-interface/chain'

export const AMM_SUPPORTED_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.BIFROST_KUSAMA,
  ParachainId.BIFROST_POLKADOT,
]

export const UNI_SUPPORTED_CHAINS = [
  ParachainId.ARBITRUM_ONE,
  ParachainId.BASE,
]

export const LIFI_SUPPORTED_CHAINS = [
  ParachainId.MOONBEAM,
  ParachainId.MOONRIVER,
]

export const ALL_CHAINS = Array.from(
  new Set([
    ...AMM_SUPPORTED_CHAINS,
    ...UNI_SUPPORTED_CHAINS,
    ...LIFI_SUPPORTED_CHAINS,
  ]),
)
