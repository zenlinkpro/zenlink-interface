import type { LiquidityPosition, POOL_TYPE } from '@zenlink-interface/graph-client'

export interface CellProps {
  row: LiquidityPosition<POOL_TYPE>
}
