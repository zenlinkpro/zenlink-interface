import type { ColumnDef } from '@tanstack/react-table'
import type { LiquidityPosition, POOL_TYPE } from '@zenlink-interface/graph-client'
import { Trans } from '@lingui/macro'
import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'
import { PairNameCell } from './PairNameCell'
import { PairValueCell } from './PairValueCell'

type TData = LiquidityPosition<POOL_TYPE>

export const NETWORK_COLUMN: ColumnDef<TData, unknown> = {
  id: 'network',
  header: _ => <Trans>Network</Trans>,
  cell: props => <PairChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const NAME_COLUMN: ColumnDef<TData, unknown> = {
  id: 'name',
  header: _ => <Trans>Name</Trans>,
  cell: props => <PairNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />
          <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />
        </div>
      </div>
    ),
  },
}

export const VALUE_COLUMN: ColumnDef<TData, unknown> = {
  id: 'value',
  header: _ => <Trans>Value</Trans>,
  accessorFn: row => row.valueUSD,
  cell: props => <PairValueCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const APR_COLUMN: ColumnDef<TData, unknown> = {
  id: 'apr',
  header: _ => <Trans>Best APR</Trans>,
  accessorFn: row => row.pool.apr,
  cell: props => <PairAPRCell row={props.row.original} />,
  size: 150,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
