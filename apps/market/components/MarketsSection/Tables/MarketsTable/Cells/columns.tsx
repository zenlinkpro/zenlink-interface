import { Trans } from '@lingui/macro'
import type { ColumnDef } from '@tanstack/react-table'
import type { Market } from '@zenlink-interface/market'
import { MarketTVLCell } from './MarketTVLCell'
import { MarketNameCell } from './MarketNameCell'
import { MarketMaturityCell } from './MarketMaturityCell'

export const NAME_COLUMN: ColumnDef<Market, unknown> = {
  id: 'name',
  header: _ => <Trans>Name</Trans>,
  cell: props => <MarketNameCell row={props.row.original} />,
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

export const MATURITY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'maturity',
  header: _ => <Trans>Maturity</Trans>,
  accessorFn: row => Number(row.expiry.toString()),
  cell: props => <MarketMaturityCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TVL_COLUMN: ColumnDef<Market, unknown> = {
  id: 'liquidityUSD',
  header: _ => <Trans>TVL</Trans>,
  accessorFn: row => Number(row.marketState.totalLp.toSignificant(6)),
  cell: props => <MarketTVLCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
