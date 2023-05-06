import { AppearOnMount, Typography, useBreakpoint } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { Fragment, useState } from 'react'

import type { Pool } from '@zenlink-interface/graph-client'
import { Trans } from '@lingui/macro'
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
            <button onClick={() => setOpenPosition(true)} className="inline-flex px-4 py-3 cursor-pointer">
              <Typography variant="sm" weight={600} className="text-slate-50">
                <Trans>My Position</Trans>
              </Typography>
            </button>
            <button onClick={() => setOpenRewards(true)} className="inline-flex px-4 py-3 cursor-pointer">
              <Typography variant="sm" weight={600} className="text-slate-50">
                <Trans>
                  My Rewards
                </Trans>
              </Typography>
            </button>
          </div>
        </div>
        <PoolActionBarPositionDialog pool={pool} open={openPosition} setOpen={setOpenPosition} />
        <PoolActionBarPositionRewards pool={pool} open={openRewards} setOpen={setOpenRewards} />
      </div>
    </AppearOnMount>
  )
}
