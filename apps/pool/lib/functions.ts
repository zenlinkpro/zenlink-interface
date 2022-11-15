import type { StableSwap } from '@zenlink-interface/amm'
import { Pair } from '@zenlink-interface/amm'

export const isStandardPool = (pool: Pair | StableSwap | null): pool is Pair => {
  return pool instanceof Pair
}
