import legacyRouterABI from '@zenlink-dex/zenlink-evm-contracts/abi/SwapRouterV1.json'
import { TradeVersion } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import universalRouterABI from '../abis/universal-router.json'

const swapRouters: Record<TradeVersion, Record<number, string>> = {
  [TradeVersion.LEGACY]: {
    [ParachainId.ASTAR]: '0x4e231728d42565830157FFFaBBB9c78aD5152E94',
    [ParachainId.MOONBEAM]: '0x5711112f7bce2dbbC95cf946dB9eEf0Ca6572242',
    [ParachainId.MOONRIVER]: '0xFB45b575b66C99e0C8d2639aCf237807d4ea1508',
  },
  [TradeVersion.AGGREGATOR]: {
    [ParachainId.ASTAR]: '0x1B5a2f88420ff329406D108e641e52E46465F68e',
  },
}

export const getSwapRouterContractConfig = (chainId: number | undefined, version: TradeVersion | undefined) => ({
  address: version ? swapRouters[version][chainId ?? -1] ?? '' : '',
  abi: version
    ? version === TradeVersion.LEGACY
      ? legacyRouterABI
      : universalRouterABI
    : '',
})
