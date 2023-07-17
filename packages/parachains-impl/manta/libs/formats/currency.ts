import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'

export function addressToCurrencyId(address: string): number {
  return addressToZenlinkAssetId(address).assetIndex
}

export function nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(assetId: number, chainId: number): ZenlinkProtocolPrimitivesAssetId {
  return {
    chainId,
    assetType: assetId === 0 ? 0 : 2,
    assetIndex: assetId,
  }
}
