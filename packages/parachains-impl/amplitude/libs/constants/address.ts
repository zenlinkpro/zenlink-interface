import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

export const PAIR_ADDRESSES: Record<string, { address: string, account: string }> = {
  // AMPE-KSM
  '2124-0-0-2124-2-256': {
    address: '2124-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
  },
  // PEN-DOT
  // TODO replace these values with the actual values when the tx passes
  '2094-0-0-2094-2-256': {
    address: '2094-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
  },
  // PEN-GLMR
  '2094-0-0-2094-2-262': {
    address: '2094-2-1125281432320',
    account: '6dZRnXf96SQyUc8WF1Uhr75nZTGs3GaUZzpQX3nPLE52XTnj',
  },
  // XLM-DOT
  '2094-2-256-2094-2-512': {
    address: '2094-2-2199040033536',
    account: '6dZRnXf96SQyUc8WF1UfP9oTVXysJVgXT1wQWFg1hXqYiPbC',
  },
   // PEN-XLM
   '2094-0-0-2094-2-512': {
    address: '2094-2-2199023256320',
    account: '6dZRnXf96SQyUc8WF1UjuSqPCVsQkNKz1sunYim24vc2L6sp',
  },
}



export const pairAddressToAssets = Object.entries(PAIR_ADDRESSES)
  .reduce<Record<string, PairPrimitivesAssetId>>(
    (acc, [assetsAddress, { address }]) => {
      const addresses = (assetsAddress.match(/\d+(-\d+)(-\d+)/g) || []).filter(isZenlinkAddress)
      const assetsId = addresses.map(addressToZenlinkAssetId) as PairPrimitivesAssetId
      acc[address] = assetsId
      return acc
    },
    {},
  )
