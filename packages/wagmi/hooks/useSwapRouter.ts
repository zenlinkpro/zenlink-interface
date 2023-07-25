import { TradeVersion } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import { getAggregationRouterAddressForChainId, isAggregationRouter } from '@zenlink-interface/smart-router'
import { aggregationRouter, legacySwapRouter, universalRouter } from '../abis'

const swapRouters: Record<TradeVersion, Record<number, string>> = {
  [TradeVersion.LEGACY]: {
    [ParachainId.ASTAR]: '0x4e231728d42565830157FFFaBBB9c78aD5152E94',
    [ParachainId.MOONBEAM]: '0x5711112f7bce2dbbC95cf946dB9eEf0Ca6572242',
    [ParachainId.MOONRIVER]: '0xFB45b575b66C99e0C8d2639aCf237807d4ea1508',
  },
  [TradeVersion.AGGREGATOR]: {
    [ParachainId.ASTAR]: '0x41479dBb983b85587bfEDd11D1Fcfe6ACe138AE1',
    [ParachainId.ARBITRUM_ONE]: '0x6A6FC6B4d33E27087410Ff5d5F15995dabDF4Ce7',
    [ParachainId.MOONBEAM]: getAggregationRouterAddressForChainId(ParachainId.MOONBEAM),
    [ParachainId.SCROLL_TESTNET]: getAggregationRouterAddressForChainId(ParachainId.SCROLL_TESTNET),
  },
}

export const getSwapRouterContractConfig = (chainId: number | undefined, version: TradeVersion | undefined) => ({
  address: version ? swapRouters[version][chainId ?? -1] ?? '' : '',
  abi: version
    ? version === TradeVersion.LEGACY
      ? legacySwapRouter
      : isAggregationRouter(chainId) ? aggregationRouter : universalRouter
    : '',
})
