import type { Pool } from '@zenlink-interface/graph-client'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { PoolChainCell } from './PoolChainCell'
import { PoolFees24hCell } from './PoolFees24hCell'
import { PoolNameCell } from './PoolNameCell'
import { PoolTVLCell } from './PoolTVLCell'
import { PoolVolume24hCell } from './PoolVolume24hCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: 'Network',
  cell: props => <PoolChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: props => <PoolNameCell row={props.row.original} />,
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

export const TVL_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'TVL',
  id: 'liquidityUSD',
  accessorFn: row => Number(row.reserveUSD),
  cell: props => <PoolTVLCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume',
  header: 'Volume (24h)',
  cell: props => <PoolVolume24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FEES_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Fees (24h)',
  id: 'fees',
  cell: props => <PoolFees24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
