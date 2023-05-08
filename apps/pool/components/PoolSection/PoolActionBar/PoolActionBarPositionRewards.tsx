import type { Pool } from '@zenlink-interface/graph-client'
import { Dialog } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback } from 'react'

import { useFarmsFromPool } from 'lib/hooks'
import { useAverageBlockTime } from '@zenlink-interface/compat'
import { t } from '@lingui/macro'
import { usePoolPosition } from '../../PoolPositionProvider'
import { PoolMyRewardsMobile } from '../PoolMyRewards/PoolMyRewardsMobile'

interface PoolActionBarPositionRewardsProps {
  pool: Pool
  open: boolean
  setOpen(open: boolean): void
}

export const PoolActionBarPositionRewards: FC<PoolActionBarPositionRewardsProps> = ({ pool, open, setOpen }) => {
  const { isError, isLoading, balance } = usePoolPosition()
  const { farms } = useFarmsFromPool(pool)
  const averageBlockTime = useAverageBlockTime(pool.chainId)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog onClose={handleClose} open={open}>
      <Dialog.Content className="!pb-6">
        <Dialog.Header title={t`My Rewards`} onClose={handleClose} />
        {isLoading && !isError && !balance
          ? (
            <div className="flex flex-col gap-2 px-2 py-4 mt-2">
              <div className="grid justify-between grid-cols-10 gap-10 mb-2">
                <div className="h-[20px] bg-slate-400 dark:bg-slate-600 animate-pulse col-span-8 rounded-full" />
                <div className="h-[20px] bg-slate-400 dark:bg-slate-600 animate-pulse col-span-2 rounded-full" />
              </div>
              <div className="grid justify-between grid-cols-10 gap-10">
                <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-8 rounded-full" />
                <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-2 rounded-full" />
              </div>
              <div className="grid justify-between grid-cols-10 gap-10">
                <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-8 rounded-full" />
                <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-2 rounded-full" />
              </div>
            </div>
            )
          : (
            <div className="flex flex-col gap-3 px-2 py-4">
              {farms.map(farm => (
                <PoolMyRewardsMobile
                  averageBlockTime={averageBlockTime}
                  key={farm.pid}
                  pid={farm.pid}
                  pool={pool}
                  farm={farm}
                />
              ))}
            </div>
            )}
      </Dialog.Content>
    </Dialog>
  )
}
