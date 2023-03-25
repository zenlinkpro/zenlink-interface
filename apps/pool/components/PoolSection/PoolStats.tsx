import { formatPercent, formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
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
    const currentHourIndex = parseInt((new Date().getTime() / 3600000).toString(), 10)
    const hourStartUnix1d = Number(currentHourIndex - 24) * 3600000
    const hourStartUnix2d = Number(currentHourIndex - 48) * 3600000
    const volume1d = pool.poolHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix1d)
      .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
    const volume2d = pool.poolHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix2d && Number(hourData.hourStartUnix) < hourStartUnix1d)
      .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)

    return volume1d && volume2d && Number(volume2d) > 0
      ? (Number(volume1d) - Number(volume2d)) / Number(volume2d)
      : null
  }, [pool.poolHourData])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-slate-200 dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-600 dark:text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-900 dark:text-slate-50">
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
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-slate-200 dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-600 dark:text-slate-400">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-slate-900 dark:text-slate-50">
          {formatUSD(pool.volume1d)}
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
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-slate-200 dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-600 dark:text-slate-400">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-slate-900 dark:text-slate-50">
          {formatUSD(pool.fees1d)}
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
