import { Trans } from '@lingui/macro'
import type { ColumnDef } from '@tanstack/react-table'
import type { Market } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { MarketLiquidityCell } from './MarketLiquidityCell'
import { MarketNameCell } from './MarketNameCell'
import { MarketMaturityCell } from './MarketMaturityCell'
import { UnderlyingAPYCell } from './UnderlyingAPYCell'
import { ImpliedAPYCell } from './ImpliedAPYCell'
import { LongYieldAPYCell } from './LongYieldAPYCell'
import { FixedAPYCell } from './FiexedAPYCell'

export const NAME_COLUMN: ColumnDef<Market, unknown> = {
  id: 'market',
  header: _ => <Trans>Market</Trans>,
  cell: props => <MarketNameCell row={props.row.original} />,
  size: 120,
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
  header: _ => <Trans>Liquidity</Trans>,
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
  header: _ => <Trans>Underlying APY</Trans>,
  accessorFn: row => 0,
  cell: props => <UnderlyingAPYCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const IMPLIED_APY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'impliedAPY',
  header: _ => <Trans>Implied APY</Trans>,
  accessorFn: row => 0,
  cell: props => <ImpliedAPYCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const LONG_YIELD_APY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'longYieldAPY',
  header: _ => <Trans>Long Yield APY</Trans>,
  accessorFn: row => 0,
  cell: props => <LongYieldAPYCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FIXED_APY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'fixedAPY',
  header: _ => <Trans>Fixed APY</Trans>,
  accessorFn: row => 0,
  cell: props => <FixedAPYCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
