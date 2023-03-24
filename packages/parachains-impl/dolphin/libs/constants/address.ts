import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

export const PAIR_ADDRESSES: Record<string, { address: string; account: string }> = {
  '2084-2-8-2084-2-9': {
    address: '2084-2-10',
    account: 'dmwQify2twJu1L58gRy6uSeGCJQkUm8T2Rt9qSigbVneMTXHw',
  },
}

// export const pairAddressToAssets = Object.entries(PAIR_ADDRESSES)
//   .reduce<Record<string, PairPrimitivesAssetId>>(
//     (acc, [assetsAddress, { address }]) => {
//       const addresses = (assetsAddress.match(/\d+(-\d+)(-\d+)/g) || []).filter(isZenlinkAddress)
//       const assetsId = addresses.map(addressToZenlinkAssetId) as PairPrimitivesAssetId
//       acc[address] = assetsId
//       return acc
//     }, {})
