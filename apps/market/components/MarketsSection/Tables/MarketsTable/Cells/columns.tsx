import { Trans } from '@lingui/macro'
import type { ColumnDef } from '@tanstack/react-table'
import type { Market } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { Typography } from '@zenlink-interface/ui'
import { MarketLiquidityCell } from './MarketLiquidityCell'
import { MarketNameCell } from './MarketNameCell'
import { MarketMaturityCell } from './MarketMaturityCell'
import { UnderlyingAPYCell } from './UnderlyingAPYCell'

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
  accessorFn: row => JSBI.toNumber(row.expiry),
  cell: props => <MarketMaturityCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'liquidityUSD',
  header: _ => <Trans>TVL</Trans>,
  accessorFn: row => Number(row.marketState.totalLp.toSignificant(6)),
  cell: props => <MarketLiquidityCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const UNDERLYING_APY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'underlyingAPY',
  header: _ => (
    <div>
      <Typography><Trans>Underlying APY</Trans></Typography>
      <Typography><Trans>Price</Trans></Typography>
    </div>
  ),
  cell: props => <UnderlyingAPYCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
