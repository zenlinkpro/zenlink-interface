import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

export const PAIR_ADDRESSES: Record<string, { address: string; account: string }> = {
  // KMA-KAR
  '2084-0-0-2084-2-8': {
    address: '2084-2-9',
    account: 'dmwQify2twJu1L58gRy74BjkzvDFyqPLgKXWf9vedj5FQQUN4',
  },
}

export const pairAddressToAssets = Object.entries(PAIR_ADDRESSES)
  .reduce<Record<string, PairPrimitivesAssetId>>(
    (acc, [assetsAddress, { address }]) => {
      const addresses = (assetsAddress.match(/\d+(-\d+)(-\d+)/g) || []).filter(isZenlinkAddress)
      const assetsId = addresses.map(addressToZenlinkAssetId) as PairPrimitivesAssetId
      acc[address] = assetsId
      return acc
    }, {})
