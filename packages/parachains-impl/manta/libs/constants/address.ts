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
  // KMA-PHA
  '2084-0-0-2084-2-13': {
    address: '2084-2-19',
    account: 'dmwQify2twJu1L58gRy6vrNsYdEN7nB7RqYQ1xwpmSajmdG3G',
  },

  // Manta Staging
  // MANTA-USDT
  '2104-0-0-2104-2-9': {
    address: '2104-2-33',
    account: 'dfZ2W8UP6LgvVLKEzTtoZgPzrS2kSVm7FkbrUKXTpKsC1VBzk',
  },
  // MANTA-GLMR
  '2104-0-0-2104-2-10': {
    address: '2104-2-34',
    account: 'dfZ2W8UP6LgvVLKEzTtoZJoLinXcGxVupwMfrLeY1ccJTgCsZ',
  },
  // MANTA-ACA
  '2104-0-0-2104-2-11': {
    address: '2104-2-35',
    account: 'dfZ2W8UP6LgvVLKEzTtoXtm23ZSur1z5PihUDRjBXQiUzwVSh',
  },
  // MANTA-LDOT
  '2104-0-0-2104-2-12': {
    address: '2104-2-36',
    account: 'dfZ2W8UP6LgvVLKEzTtoSP2XX4BR4k3Jansd7UwLN79gWcw8V',
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
