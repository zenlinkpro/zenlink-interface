import type { Pool } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { Trans } from '@lingui/macro'

import { AppearOnMount, Typography, useBreakpoint } from '@zenlink-interface/ui'
import { Fragment, useState } from 'react'
import { PoolActionBarPositionDialog } from './PoolActionBarPositionDialog'
import { PoolActionBarPositionRewards } from './PoolActionBarPositionRewards'

interface PoolActionBarProps {
  pool: Pool
}

export const PoolActionBar: FC<PoolActionBarProps> = ({ pool }) => {
  const [openPosition, setOpenPosition] = useState<boolean>(false)
  const [openRewards, setOpenRewards] = useState<boolean>(false)

  const { isLg } = useBreakpoint('lg')

  if (isLg)
    return <></>

  return (
    <AppearOnMount as={Fragment}>
      <div className="fixed left-0 right-0 flex justify-center bottom-6">
        <div>
          <div className="divide-x rounded-full shadow-md shadow-white/20 dark:shadow-black/20 bg-blue divide-slate-800">
            <button className="inline-flex px-4 py-3 cursor-pointer" onClick={() => setOpenPosition(true)}>
              <Typography className="text-slate-50" variant="sm" weight={600}>
                <Trans>My Position</Trans>
              </Typography>
            </button>
            <button className="inline-flex px-4 py-3 cursor-pointer" onClick={() => setOpenRewards(true)}>
              <Typography className="text-slate-50" variant="sm" weight={600}>
                <Trans>
                  My Rewards
                </Trans>
              </Typography>
            </button>
          </div>
        </div>
        <PoolActionBarPositionDialog open={openPosition} pool={pool} setOpen={setOpenPosition} />
        <PoolActionBarPositionRewards open={openRewards} pool={pool} setOpen={setOpenRewards} />
      </div>
    </AppearOnMount>
  )
}
