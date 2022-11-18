import type { StableSwap } from '@zenlink-interface/amm'
import { Pair } from '@zenlink-interface/amm'
import { POOL_TYPE } from '@zenlink-interface/graph-client'

export const isStandardPool = (pool: Pair | StableSwap | null): pool is Pair => {
  return pool instanceof Pair
}

export const swapFeeOfPool = (type: POOL_TYPE) => {
  return type === POOL_TYPE.STANDARD_POOL ? '0.30%' : '0.05%'
}
