import { Trans } from '@lingui/macro'
import { Button, Dots, Typography } from '@zenlink-interface/ui'
import { VoteMode, useGaugeVotes } from 'components'
import type { FC } from 'react'

import { GaugesTable } from './Tables'

export const GaugesSection: FC = () => {
  const {
    unusedVotePercent,
    voteMode,
    setVoteMode,
    onClearInputVote,
    isWritePending,
    sendTransaction,
  } = useGaugeVotes()

  const isViewMode = voteMode === VoteMode.VIEW

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-slate-900 dark:text-slate-50">
        <div className="flex gap-2">
          <Typography variant="base" weight={600}>
            <Trans>Unused veZLK</Trans>:
          </Typography>
          <Typography variant="base" weight={600}>
            {unusedVotePercent.toFixed(0)}%
          </Typography>
        </div>
        {isViewMode
          ? (
            <Button
              onClick={() => { setVoteMode(VoteMode.UPDATE) }}
              size="sm"
            >
              <Trans>Vote</Trans>
            </Button>
            )
          : (
            <div className="flex gap-2">
              <Button
                color="gray"
                onClick={() => {
                  onClearInputVote()
                  setVoteMode(VoteMode.VIEW)
                }}
                size="sm"
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                disabled={!sendTransaction || isWritePending}
                onClick={() => sendTransaction?.()}
                size="sm"
              >
                {
                  isWritePending
                    ? <Dots><Trans>Confirm</Trans></Dots>
                    : <Trans>Update</Trans>
                }
              </Button>
            </div>
            )}
      </div>
      <GaugesTable />
    </section>
  )
}
