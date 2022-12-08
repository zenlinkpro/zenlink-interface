import { formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

interface PoolStatsProps {
  pool: Pool
}

export const PoolStats: FC<PoolStatsProps> = ({ pool }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pool.reserveUSD)}
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pool.poolDayData[1]?.dailyVolumeUSD)}
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(Number(pool.poolDayData[1]?.dailyVolumeUSD || 0) * (pool.type === POOL_TYPE.STANDARD_POOL ? 0.0015 : 0.00025))}
        </Typography>
      </div>
    </div>
  )
}
