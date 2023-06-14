import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'
import type { NodePrimitivesCurrency } from '../../types'

export function addressToCurrencyId(address: string): number {
  return addressToZenlinkAssetId(address).assetIndex
}

export function nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(currency: NodePrimitivesCurrency, chainId: number): ZenlinkProtocolPrimitivesAssetId {
  // FIXME: need to change real tokenIndex
  const tokenIndex = 0
  return {
    chainId,
    assetType: tokenIndex === 0 ? 0 : 2,
    assetIndex: tokenIndex,
  }
}
