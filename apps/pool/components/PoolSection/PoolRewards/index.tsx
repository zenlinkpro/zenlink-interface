import { formatPercent } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { AppearOnMount, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { Trans } from '@lingui/macro'
import { useFarmsFromPool } from '../../../lib/hooks'
import { FarmingRewards } from './FarmingRewards'

export * from './FarmingRewards'

interface PoolRewardsProps {
  pool: Pool
}

export const PoolRewards: FC<PoolRewardsProps> = ({ pool }) => {
  const { farms, bestStakeApr } = useFarmsFromPool(pool)

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <Typography weight={600} className="text-slate-900 dark:text-slate-50">
          <Trans>Farming Rewards</Trans>
        </Typography>
        <AppearOnMount>
          <Typography variant="sm" weight={400} className="text-slate-600 dark:text-slate-400">
            <Trans>Best Reward APR:</Trans>
            <span className="font-semibold text-slate-900 dark:text-slate-50 ml-1">
              {formatPercent(bestStakeApr)}
            </span>
          </Typography>
        </AppearOnMount>
      </div>
      <AppearOnMount>
        {farms.length > 0
          ? (
            <div className="flex flex-col gap-4">
              {farms.map(farm => (
                <FarmingRewards
                  incentives={farm.incentives}
                  farm={farm}
                  key={farm.pid} pool={pool} />
              ))}
            </div>
            )
          : (
            <Typography
              variant="xs"
              className="w-full italic text-center dark:text-slate-400 text-gray-600"
            >
              <Trans>No farms found</Trans>
            </Typography>
            )
        }
      </AppearOnMount>
    </div>
  )
}
