import { ParachainId } from '@zenlink-interface/chain'

export const ZENLINK_ENABLED_NETWORKS = [
  ParachainId.MOONBEAM,
  ParachainId.MOONRIVER,
  ParachainId.ASTAR,
] as const

export const SQUID_HOST_ENDPOINT = 'https://squid.subsquid.io'

export const SQUID_HOST: Record<number | string, string> = {
  [ParachainId.ASTAR]: `${SQUID_HOST_ENDPOINT}/Zenlink-Astar-Squid/graphql`,
  [ParachainId.MOONRIVER]: `${SQUID_HOST_ENDPOINT}/zenlink-moonriver-squid/graphql`,
  [ParachainId.MOONBEAM]: `${SQUID_HOST_ENDPOINT}/Zenlink-Moonbeam-Squid/graphql`,
}
