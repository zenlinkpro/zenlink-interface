import type { StableSwap } from '@zenlink-interface/amm'

export interface StableSwapWithBase extends StableSwap {
  baseSwap?: StableSwap
}
