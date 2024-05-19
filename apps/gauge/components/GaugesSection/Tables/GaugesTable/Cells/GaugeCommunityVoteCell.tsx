import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useGaugeVotes } from 'components'
import { Percent } from '@zenlink-interface/math'
import type { CellProps } from './types'

export const GaugeCommunityVoteCell: FC<CellProps> = ({ row }) => {
  const { communityVotedPercentMap } = useGaugeVotes()

  return (
    <div className="flex items-center">
      <Typography className="flex items-center text-slate-900 dark:text-slate-50" variant="base" weight={600}>
        {(communityVotedPercentMap[row.id] || new Percent(0)).toFixed(0)}%
      </Typography>

    </div>
  )
}
