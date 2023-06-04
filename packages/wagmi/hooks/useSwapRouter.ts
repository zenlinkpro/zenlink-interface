import { TradeVersion } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import { LegacySwapRouter } from '../abis'
import universalRouterABI from '../abis/universal-router.json'

const swapRouters: Record<TradeVersion, Record<number, string>> = {
  [TradeVersion.LEGACY]: {
    [ParachainId.ASTAR]: '0x4e231728d42565830157FFFaBBB9c78aD5152E94',
    [ParachainId.MOONBEAM]: '0x5711112f7bce2dbbC95cf946dB9eEf0Ca6572242',
    [ParachainId.MOONRIVER]: '0xFB45b575b66C99e0C8d2639aCf237807d4ea1508',
  },
  [TradeVersion.AGGREGATOR]: {
    [ParachainId.ASTAR]: '0x41479dBb983b85587bfEDd11D1Fcfe6ACe138AE1',
  },
}

export const getSwapRouterContractConfig = (chainId: number | undefined, version: TradeVersion | undefined) => ({
  address: version ? swapRouters[version][chainId ?? -1] ?? '' : '',
  abi: version
    ? version === TradeVersion.LEGACY
      ? LegacySwapRouter
      : universalRouterABI
    : '',
})
