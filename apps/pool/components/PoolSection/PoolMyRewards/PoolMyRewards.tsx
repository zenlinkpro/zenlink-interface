import type { Pool } from '@zenlink-interface/graph-client'
import { Typography, useBreakpoint } from '@zenlink-interface/ui'
import { useFarmsFromPool } from 'lib/hooks'
import type { FC } from 'react'
import { Trans } from '@lingui/macro'
import { useAverageBlockTime } from '@zenlink-interface/compat'
import { formatUSD } from '@zenlink-interface/format'
import { usePoolPositionRewards } from '../../PoolPositionRewardsProvider'
import { PoolMyRewardsDesktop } from './PoolMyRewardsDesktop'

interface PoolMyRewardsProps {
  pool: Pool
}

export const PoolMyRewards: FC<PoolMyRewardsProps> = ({ pool }) => {
  const { isLg } = useBreakpoint('lg')
  const { values } = usePoolPositionRewards()

  const averageBlockTime = useAverageBlockTime(pool.chainId)
  const { farms } = useFarmsFromPool(pool)

  if (!isLg || !farms.length)
    return <></>

  return (
    <div className="flex flex-col shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 rounded-2xl shadow-white/30 dark:shadow-black/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-500/20 dark:border-slate-200/5">
        <Typography className="text-slate-900 dark:text-slate-50" weight={600}>
          <Trans>My Rewards</Trans>
        </Typography>
        <div className="flex flex-col">
          <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
            {formatUSD(values.reduce((total, current) => total + current, 0))}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        {farms.map(farm => (
          <PoolMyRewardsDesktop
            averageBlockTime={averageBlockTime}
            farm={farm}
            key={farm.pid}
            pid={farm.pid}
            pool={pool}
          />
        ))}
      </div>
    </div>
  )
}
