import { ParachainId } from '@zenlink-interface/chain'

export const ENABLED_AGGREGATION_ROUTER_CHAINS = [
  ParachainId.MOONBEAM,
]

export function isAggregationRouter(chainId?: number) {
  return Boolean(chainId && ENABLED_AGGREGATION_ROUTER_CHAINS.includes(chainId))
}

export function getAggregationExecutorAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x832B21FA3AA074Ee5328f653D9DB147Bcb155C7a'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

export function getAggregationRouterAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x3494764d3bE100BA489c8BC5C3438E7629c5e5E5'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}
