import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

export const PAIR_ADDRESSES: Record<string, { address: string, account: string }> = {
  // AMPE-KSM
  '2124-0-0-2124-2-256': {
    address: '2124-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
  },
  // PEN-DOT
  '2094-0-0-2094-2-256': {
    //TODO where to get this for Pendulum? Especially the account.
    address: '2094-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
  },
  // PEN-GLMR
  '2094-0-0-2094-2-262': {
    //TODO where to get this for Pendulum? Especially the account.
    address: '2094-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
  },
  // XLM-DOT
  '2094-2-256-2094-2-512': {
    //TODO where to get this for Pendulum? Especially the account.
    address: '2094-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
  },
   // PEN-XLM
   '2094-0-0-2094-2-512': {
    //TODO where to get this for Pendulum? Especially the account.
    address: '2094-2-1099511628544',
    account: '6jM63XCYUjHhdfXy9YMa2fKa9z4nqyJTb4DQxjm5mqsXBBQ5',
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
