import { formatPercent, formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo } from 'react'

interface PoolStatsProps {
  pool: Pool
}

export const PoolStats: FC<PoolStatsProps> = ({ pool }) => {
  const liquidity1dChange = useMemo(() => {
    const currentLiquidity = pool.poolDayData[0]?.reserveUSD || '0'
    const prevLiquidity = pool.poolDayData[1]?.reserveUSD || '0'

    return currentLiquidity && prevLiquidity && Number(prevLiquidity) > 0
      ? (Number(currentLiquidity) - Number(prevLiquidity)) / Number(prevLiquidity)
      : null
  }, [pool.poolDayData],
  )

  const volume1dChange = useMemo(() => {
    const currentVolume = pool.poolDayData[1]?.dailyVolumeUSD || '0'
    const prevVolume = pool.poolDayData[2]?.dailyVolumeUSD || '0'

    return currentVolume && prevVolume && Number(prevVolume) > 0
      ? (Number(currentVolume) - Number(prevVolume)) / Number(prevVolume)
      : null
  }, [pool.poolDayData])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pool.reserveUSD)}
        </Typography>
        {liquidity1dChange
          ? (
          <Typography variant="xs" weight={500} className={liquidity1dChange > 0 ? 'text-green' : 'text-red'}>
            {liquidity1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(liquidity1dChange))}
          </Typography>
            )
          : null}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pool.poolDayData[1]?.dailyVolumeUSD)}
        </Typography>
        {volume1dChange
          ? (
          <Typography variant="xs" weight={500} className={volume1dChange > 0 ? 'text-green' : 'text-red'}>
            {volume1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(volume1dChange))}
          </Typography>
            )
          : null}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(Number(pool.poolDayData[1]?.dailyVolumeUSD || 0) * (pool.type === POOL_TYPE.STANDARD_POOL ? 0.0015 : 0.00025))}
        </Typography>
        {volume1dChange
          ? (
          <Typography variant="xs" weight={500} className={volume1dChange > 0 ? 'text-green' : 'text-red'}>
            {volume1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(volume1dChange))}
          </Typography>
            )
          : null}
      </div>
    </div>
  )
}
