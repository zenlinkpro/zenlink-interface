import type { ColumnDef } from '@tanstack/react-table'
import type { DiscountTiers } from 'lib/hooks'
import { Trans } from '@lingui/macro'
import { DiscountCell } from './DiscountCell'
import { PositionSizeCell } from './PositionSizeCell'
import { TierCell } from './TierCell'

export const TIERS_COLUMN: ColumnDef<DiscountTiers, unknown> = {
  id: 'tier',
  header: _ => <Trans>Tier</Trans>,
  cell: props => <TierCell row={props.row.original} />,
  size: 30,
  meta: {
    skeleton: <div className="rounded-full rouned bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const POSITIONS_COLUMN: ColumnDef<DiscountTiers, unknown> = {
  id: 'positionSize',
  header: _ => <Trans>Position Size</Trans>,
  cell: props => <PositionSizeCell row={props.row.original} />,
  size: 100,
  meta: {
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const DISCOUNTS_COLUMN: ColumnDef<DiscountTiers, unknown> = {
  id: 'discount',
  header: _ => <Trans>Discount</Trans>,
  cell: props => <DiscountCell row={props.row.original} />,
  size: 30,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}
