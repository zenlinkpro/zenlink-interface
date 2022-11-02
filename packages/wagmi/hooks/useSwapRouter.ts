import swapRouterABI from '@zenlink-dex/zenlink-evm-contracts/abi/SwapRouterV1.json'
import { ParachainId } from '@zenlink-interface/chain'

const swapRouters: Record<number, string> = {
  [ParachainId.ASTAR]: '0x4e231728d42565830157FFFaBBB9c78aD5152E94',
  [ParachainId.MOONBEAM]: '0x5711112f7bce2dbbC95cf946dB9eEf0Ca6572242',
  [ParachainId.MOONRIVER]: '0xFB45b575b66C99e0C8d2639aCf237807d4ea1508',
}

export const getSwapRouterContractConfig = (chainId: number | undefined) => ({
  address: swapRouters[chainId ?? -1] ?? '',
  abi: swapRouterABI,
})
