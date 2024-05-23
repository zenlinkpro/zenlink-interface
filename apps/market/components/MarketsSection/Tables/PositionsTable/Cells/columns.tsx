import { Trans } from '@lingui/macro'
import type { ColumnDef } from '@tanstack/react-table'
import type { MarketPosition } from '@zenlink-interface/wagmi'
import { PositionNameCell } from './PositionNameCell'
import { PositionPtBalanceCell } from './PositionPtBalanceCell'
import { PositionYtBalanceCell } from './PositionYtBalanceCell'
import { PositionLpBalanceCell } from './PositionLpBalanceCell'

export const NAME_COLUMN: ColumnDef<MarketPosition, unknown> = {
  id: 'name',
  header: _ => <Trans>Name</Trans>,
  cell: props => <PositionNameCell row={props.row.original} />,
  size: 180,
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

export const PT_BALANCE_COLUMN: ColumnDef<MarketPosition, unknown> = {
  id: 'ptBalance',
  header: _ => <Trans>PT</Trans>,
  accessorFn: row => Number(row.ptBalance?.toSignificant(6) || '0'),
  cell: props => <PositionPtBalanceCell row={props.row.original} />,
  size: 30,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const YT_BALANCE_COLUMN: ColumnDef<MarketPosition, unknown> = {
  id: 'ytBalance',
  header: _ => <Trans>YT</Trans>,
  accessorFn: row => Number(row.ytBalance?.toSignificant(6) || '0'),
  cell: props => <PositionYtBalanceCell row={props.row.original} />,
  size: 30,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const LP_BALANCE_COLUMN: ColumnDef<MarketPosition, unknown> = {
  id: 'lpBalance',
  header: _ => <Trans>LP</Trans>,
  accessorFn: row => Number(row.lpBalance?.toSignificant(6) || '0'),
  cell: props => <PositionLpBalanceCell row={props.row.original} />,
  size: 60,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
