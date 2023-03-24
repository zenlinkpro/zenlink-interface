import type { Type } from '@zenlink-interface/currency'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'

export function isNativeCurrency(currency: Type): boolean {
  // BNC
  // console.log('address:' + currency.wrapped.address)
  const { assetType, assetIndex } = addressToZenlinkAssetId(currency.wrapped.address)
  // console.log('type:' + assetType + ',index:' + assetIndex)
  return assetType === 0 && assetIndex === 1
}
