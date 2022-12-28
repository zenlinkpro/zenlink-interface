import type { Type } from '@zenlink-interface/currency'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'

export function isNativeCurrency(currency: Type): boolean {
  // BNC
  const { assetType, assetIndex } = addressToZenlinkAssetId(currency.wrapped.address)
  return assetType === 0 && assetIndex === 0
}
