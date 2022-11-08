import type { ColumnDef } from '@tanstack/react-table'
import type { LiquidityPosition } from '@zenlink-interface/graph-client'
import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'

type TData = LiquidityPosition

export const NETWORK_COLUMN: ColumnDef<TData, unknown> = {
  id: 'network',
  header: 'Network',
  cell: props => <PairChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const APR_COLUMN: ColumnDef<TData, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: row => row.pair.apr,
  cell: props => <PairAPRCell row={props.row.original} />,
  size: 150,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
