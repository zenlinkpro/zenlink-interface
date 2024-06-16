import { Trans } from '@lingui/macro'
import type { ColumnDef } from '@tanstack/react-table'
import type { Market } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { Tooltip, Typography } from '@zenlink-interface/ui'
import { MarketLiquidityCell } from './MarketLiquidityCell'
import { MarketNameCell } from './MarketNameCell'
import { MarketMaturityCell } from './MarketMaturityCell'
import { UnderlyingAPYCell } from './UnderlyingAPYCell'
import { ImpliedAPYCell } from './ImpliedAPYCell'
import { LongYieldROICell } from './LongYieldROICell'
import { FixedROICell } from './FiexedROICell'

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
  header: _ => (
    <Tooltip content={(
      <div className="flex flex-col gap-2 w-80">
        <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
          <Trans>
            The maturity date of the yield contract.
          </Trans>
        </Typography>
        <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
          <Trans>
            Upon maturity, the PT can be redeemed for the underlying asset, while YT will stop
            accruing yield.
          </Trans>
        </Typography>
      </div>
    )}
    >
      <Trans>Maturity</Trans>
    </Tooltip>
  ),
  accessorFn: row => JSBI.toNumber(row.expiry),
  cell: props => <MarketMaturityCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'reserveUSD',
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
  header: _ => (
    <Tooltip content={(
      <div className="flex flex-col gap-2 w-80">
        <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
          <Trans>
            Current APY in the underlying protocol
          </Trans>
        </Typography>
        <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
          <Trans>
            Rewards accrued in the SY contract over past 7D, annualised.
          </Trans>
        </Typography>
      </div>
    )}
    >
      <Trans>Underlying APY</Trans>
    </Tooltip>
  ),
  accessorFn: () => 0,
  cell: props => <UnderlyingAPYCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const IMPLIED_APY_COLUMN: ColumnDef<Market, unknown> = {
  id: 'impliedAPY',
  header: _ => (
    <Tooltip content={(
      <Typography className="text-slate-700 dark:text-slate-300 w-80" variant="xs" weight={500}>
        <Trans>
          The average future APY that the Zenlink Market is implying by trading at the current
          YT/PT price plus any underlying asset appreciation with respect to a common base asset.
        </Trans>
      </Typography>
    )}
    >
      <Trans>Implied APY</Trans>
    </Tooltip>
  ),
  accessorFn: () => 0,
  cell: props => <ImpliedAPYCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const LONG_YIELD_ROI_COLUMN: ColumnDef<Market, unknown> = {
  id: 'longYieldAPY',
  header: _ => (
    <Tooltip content={(
      <Typography className="text-slate-700 dark:text-slate-300 w-80" variant="xs" weight={500}>
        <Trans>
          ROI for buying and holding YT at the current price, assuming the average future APY is
          equivalent to the current underlying APY.
        </Trans>
      </Typography>
    )}
    >
      <Trans>Long Yield ROI</Trans>
    </Tooltip>
  ),
  accessorFn: () => 0,
  cell: props => <LongYieldROICell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FIXED_ROI_COLUMN: ColumnDef<Market, unknown> = {
  id: 'fixedAPY',
  header: _ => (
    <Tooltip content={(
      <Typography className="text-slate-700 dark:text-slate-300 w-80" variant="xs" weight={500}>
        <Trans>
          ROI guaranteed in buying and holding PT until maturity.
        </Trans>
      </Typography>
    )}
    >
      <Trans>Fixed ROI</Trans>
    </Tooltip>
  ),
  accessorFn: () => 0,
  cell: props => <FixedROICell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
