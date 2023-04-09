import type { ColumnDef } from '@tanstack/react-table'
import type { Pool } from '@zenlink-interface/graph-client'
import React from 'react'

import { Trans } from '@lingui/macro'
import { NetworkCell } from './NetworkCell'
import { PoolFees24hCell } from './PoolFees24hCell'
import { PoolFees7dCell } from './PoolFees7dCell'
import { PoolNameCell } from './PoolNameCell'
import { PoolTVLCell } from './PoolTVLCell'
import { PoolVolume24hCell } from './PoolVolume24hCell'
import { PoolVolume7dCell } from './PoolVolume7dCell'

export const NETWORK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: '',
  cell: props => <NetworkCell row={props.row.original} />,
  size: 30,
  meta: {
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: _ => <Trans>Name</Trans>,
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
  header: _ => <Trans>TVL</Trans>,
  id: 'liquidityUSD',
  accessorFn: row => Number(row.reserveUSD),
  cell: props => <PoolTVLCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_24H_COLUMN: ColumnDef<Pool, unknown> = {
  header: _ => <Trans>Volume (24h)</Trans>,
  id: 'volume24h',
  cell: props => <PoolVolume24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_7D_COLUMN: ColumnDef<Pool, unknown> = {
  header: _ => <Trans>Volume (7d)</Trans>,
  id: 'volume7d',
  cell: props => <PoolVolume7dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FEES_24H_COLUMN: ColumnDef<Pool, unknown> = {
  header: _ => <Trans>Fees (24h)</Trans>,
  id: 'fees24h',
  cell: props => <PoolFees24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FEES_7D_COLUMN: ColumnDef<Pool, unknown> = {
  header: _ => <Trans>Fees (7d)</Trans>,
  id: 'fees7d',
  cell: props => <PoolFees7dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
