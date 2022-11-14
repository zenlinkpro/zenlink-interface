import { formatUSD } from '@zenlink-interface/format'
import type { Pair } from '@zenlink-interface/graph-client'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

interface PoolStatsProps {
  pair: Pair
}

export const PoolStats: FC<PoolStatsProps> = ({ pair }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.reserveUSD)}
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.pairDayData[0]?.dailyVolumeUSD)}
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(Number(pair.pairDayData[0]?.dailyVolumeUSD || 0) * 0.0015)}
        </Typography>
      </div>
    </div>
  )
}
