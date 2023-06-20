import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

export const PAIR_ADDRESSES: Record<string, { address: string; account: string }> = {
  // KMA-KAR
  '2084-0-0-2084-2-8': {
    address: '2084-2-9',
    account: 'dmwQify2twJu1L58gRy74BjkzvDFyqPLgKXWf9vedj5FQQUN4',
  },
  // KMA-MOVR
  '2084-0-0-2084-2-11': {
    address: '2084-2-15',
    account: 'dmwQify2twJu1L58gRy73EfHUpK6mmfp4w4Yvdw1yw1wSdPPj',
  },
  // KMA-KSM
  '2084-0-0-2084-2-12': {
    address: '2084-2-16',
    account: 'dmwQify2twJu1L58gRy73q7b8Pd25QpNsk4SaFPDYqC12aoX2',
  },
  // KMA-USDT
  '2084-0-0-2084-2-14': {
    address: '2084-2-17',
    account: 'dmwQify2twJu1L58gRy6ymUfFckd2sp5HsZTyFUWrYDeRdbAP',
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
