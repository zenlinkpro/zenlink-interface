import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

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
  // KSM-KBTC
  '2001-2-516-2001-2-2050': {
    address: '2001-2-8804716774912',
    account: 'eCSrvaystgdffuJxPVPy4UFedBDC5ZVsx7jsR8jPLZkyno1',
  },
  // vKSM-USDT
  '2001-2-260-2001-2-2048': {
    address: '2001-2-8796110063104',
    account: 'eCSrvaystgdffuJxPVNFYzcsVNZLG9E8TgSkUG1GcjD519E',
  },
  // BNC-DOT
  '2030-0-0-2030-2-2048': {
    address: '2030-2-8796093023744',
    account: 'eCSrvaystgdffuJxPVTne2cjBdWDh6yPvzt8RdkFdihjqS1',
  },
  // GLMR-vGLMR
  '2030-2-2049-2030-2-2305': {
    address: '2030-2-9900033902080',
    account: 'eCSrvaystgdffuJxPVbKj318eoUb12vu85hWk7CQFktdf79',
  },
  // vDOT-vsDOT
  '2030-2-2304-2030-2-2560': {
    address: '2030-2-10995267274240',
    account: 'eCSrvaystgdffuJxPVS4SfFvaM26m6tAxwDLPvawBAYbnJd',
  },
  // FIL-vFIL
  '2030-2-2052-2030-2-2308': {
    address: '2030-2-9912919000576',
    account: 'eCSrvaystgdffuJxPVPVePp3f8Zegp8AuNsTv4FApKHtAt9',
  },
  // DOT-vDOT
  '2030-2-2048-2030-2-2304': {
    address: '2030-2-9895738869248',
    account: 'eCSrvaystgdffuJxPVRct68qJUZs1sFz762d7d37KJvb7Pz',
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
