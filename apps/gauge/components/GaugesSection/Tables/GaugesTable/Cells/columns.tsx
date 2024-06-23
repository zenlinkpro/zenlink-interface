import { Trans } from '@lingui/macro'
import type { ColumnDef } from '@tanstack/react-table'
import type { Gauge } from '@zenlink-interface/market'

import { JSBI } from '@zenlink-interface/math'
import { GaugeCommunityVoteCell } from './GaugeCommunityVoteCell'
import { GaugeMyVoteCell } from './GaugeMyVoteCell'
import { GaugeNameCell } from './GaugeNameCell'

export const NAME_COLUMN: ColumnDef<Gauge, unknown> = {
  id: 'name',
  header: _ => <Trans>Name</Trans>,
  cell: props => <GaugeNameCell row={props.row.original} />,
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

export const COMMUNITY_VOTE_COLUMN: ColumnDef<Gauge, unknown> = {
  id: 'communityVote',
  header: _ => <Trans>Community Vote</Trans>,
  accessorFn: row => JSBI.toNumber(row.poolVote),
  cell: props => <GaugeCommunityVoteCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const MY_VOTE_COLUMN: ColumnDef<Gauge, unknown> = {
  id: 'myVote',
  header: _ => <Trans>My Vote</Trans>,
  accessorFn: row => JSBI.toNumber(row.userVote.weight),
  cell: props => <GaugeMyVoteCell row={props.row.original} />,
  size: 80,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
