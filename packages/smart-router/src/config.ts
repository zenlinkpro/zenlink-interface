import { ParachainId } from '@zenlink-interface/chain'

export const ENABLED_AGGREGATION_ROUTER_CHAINS = [
  ParachainId.MOONBEAM,
  ParachainId.SCROLL_TESTNET,
]

export function isAggregationRouter(chainId?: number) {
  return Boolean(chainId && ENABLED_AGGREGATION_ROUTER_CHAINS.includes(chainId))
}

export function getAggregationExecutorAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x832B21FA3AA074Ee5328f653D9DB147Bcb155C7a'
    case ParachainId.SCROLL_TESTNET:
      return '0xf6EA707CBf38f2Acf3bf029429B55192c61c67ad'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

export function getAggregationRouterAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x3494764d3bE100BA489c8BC5C3438E7629c5e5E5'
    case ParachainId.SCROLL_TESTNET:
      return '0xAd4f1E1Ba6bD15ab06E9eA4Dd0583b4693b669B1'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}
