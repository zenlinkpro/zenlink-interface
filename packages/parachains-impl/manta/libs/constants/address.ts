import {
  addressToZenlinkAssetId,
  isZenlinkAddress,
} from '@zenlink-interface/format'
import type { PairPrimitivesAssetId } from '../../types'

import CalamariPairs from '../../pair-configs/calamari.json'
import MantaStagingPairs from '../../pair-configs/manta-staging.json'
import MantaPairs from '../../pair-configs/manta.json'

export const PAIR_ADDRESSES: Record<
  string,
  { address: string; account: string }
> = {
  ...CalamariPairs.pairs,
  ...MantaStagingPairs.pairs,
  ...MantaPairs.pairs,
}

export const pairAddressToAssets = Object.entries(PAIR_ADDRESSES).reduce<
  Record<string, PairPrimitivesAssetId>
>((acc, [assetsAddress, { address }]) => {
  const addresses = (assetsAddress.match(/\d+(-\d+)(-\d+)/g) || []).filter(
    isZenlinkAddress,
  )
  const assetsId = addresses.map(
    addressToZenlinkAssetId,
  ) as PairPrimitivesAssetId
  acc[address] = assetsId
  return acc
}, {})
