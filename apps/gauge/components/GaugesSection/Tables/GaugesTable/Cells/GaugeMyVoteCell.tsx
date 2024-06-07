import { Percent } from '@zenlink-interface/math'
import { DEFAULT_INPUT_UNSTYLED, Input, Typography, classNames } from '@zenlink-interface/ui'
import { VoteMode, useGaugeVotes } from 'components'
import type { FC } from 'react'

import type { CellProps } from './types'

export const GaugeMyVoteCell: FC<CellProps> = ({ row }) => {
  const { votedPercentMap, voteMode, onInputVote, voteInputMap } = useGaugeVotes()

  const isViewMode = voteMode === VoteMode.VIEW

  return (
    <div className="flex items-center">
      {isViewMode
        ? (
          <Typography className="flex items-center text-slate-900 dark:text-slate-50" variant="base" weight={600}>
            {(votedPercentMap[row.id] || new Percent(0)).toFixed(0)}%
          </Typography>
          )
        : (
          <div className="flex items-center font-semibold">
            <Input.Numeric
              className={classNames(DEFAULT_INPUT_UNSTYLED, '!w-8 font-semibold')}
              error
              onUserInput={val => onInputVote(row, +val)}
              placeholder="1"
              value={(voteInputMap[row.id] || votedPercentMap[row.id] || new Percent(0)).toFixed(0)}
              variant="unstyled"
            />
            %
          </div>
          )}

    </div>
  )
}
