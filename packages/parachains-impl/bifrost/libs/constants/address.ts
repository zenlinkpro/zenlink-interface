import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'

export const PAIR_ADDRESSES: Record<string, { address: string; account: string }> = {
  // BNC-KSM
  '2001-0-0-2001-2-516': {
    address: '2001-2-2216203126272',
    account: 'eCSrvaystgdffuJxPVZUZmUBqiz2nXKWuUWHQBPqvJFeDh1',
  },
  // KSM-AUSD
  '2001-2-516-2001-2-770': {
    address: '2001-2-3307158636032',
    account: 'eCSrvaystgdffuJxPVTJc2eQMgp9PnuPh7mMaQ6KbTynFRM',
  },
  // KSM-VSKSM
  '2001-2-516-2001-2-1028': {
    address: '2001-2-4415260198400',
    account: 'eCSrvaystgdffuJxPVW4UMxAXMuTpU3jkCJeiqppyfoi6SG',
  },
  // BNC-ZLK
  '2001-0-0-2001-2-519': {
    address: '2001-2-2229088028160',
    account: 'eCSrvaystgdffuJxPVU5NQfnXRohvjWF9u8VaeUWRg1mn1y',
  },
  // KAR-ZLK
  '2001-2-518-2001-2-519': {
    address: '2001-2-2229121975808',
    account: 'eCSrvaystgdffuJxPVRWqnxeKZJ3dWu8qJYidgLLStXXkiG',
  },
  // KSM-RMRK
  '2001-2-516-2001-2-521': {
    address: '2001-2-2237711779328',
    account: 'eCSrvaystgdffuJxPVU9u7Vv2AVjXTAEwbuujLggS6t6HoE',
  },
  // VKSM-KSM
  '2001-2-260-2001-2-516': {
    address: '2001-2-2216220165632',
    account: 'eCSrvaystgdffuJxPVYKf8H8UYnHGNRdVGUvj1SWSiatWMq',
  },
  // BNC-USDT
  '2001-0-0-2001-2-2048': {
    address: '2001-2-8796093023744',
    account: 'eCSrvaystgdffuJxPVN8LrN9JeAtrYVV1usKGABuUhYdqYw',
  },
  // BNC-VBNC
  '2001-0-0-2001-2-257': {
    address: '2001-2-1103806596608',
    account: 'eCSrvaystgdffuJxPVZ7pEK8ZMmZ7Nwg2144eZYgWdx4g6v',
  },
}

export const pairAddressToAssets = Object.entries(PAIR_ADDRESSES)
  .reduce<Record<string, [ZenlinkProtocolPrimitivesAssetId, ZenlinkProtocolPrimitivesAssetId]>>(
    (acc, [assetsAddress, { address }]) => {
      const addresses = assetsAddress
        .split(/^(\d+(-\d+)(-\d+))-(\d+(-\d+)(-\d+))$/)
        .filter(isZenlinkAddress)
      const assetsId = addresses.map(addressToZenlinkAssetId) as [ZenlinkProtocolPrimitivesAssetId, ZenlinkProtocolPrimitivesAssetId]
      acc[address] = assetsId
      return acc
    }, {})
