import { Trans } from '@lingui/macro'
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
  const isSinglePool = pool.type === POOL_TYPE.SINGLE_TOKEN_POOL

  const liquidity1dChange = useMemo(() => {
    const currentLiquidity = pool.poolDayData[0]?.reserveUSD || '0'
    const prevLiquidity = pool.poolDayData[1]?.reserveUSD || '0'

    return currentLiquidity && prevLiquidity && Number(prevLiquidity) > 0
      ? (Number(currentLiquidity) - Number(prevLiquidity)) / Number(prevLiquidity)
      : null
  }, [pool.poolDayData])

  const volume1dChange = useMemo(() => {
    const currentHourIndex = Number.parseInt((new Date().getTime() / 3600000).toString(), 10)
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
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
          <Trans>Liquidity</Trans>
        </Typography>
        <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
          {formatUSD(pool.reserveUSD)}
        </Typography>
        {liquidity1dChange
          ? (
              <Typography className={liquidity1dChange > 0 ? 'text-green-600 dark:text-green' : 'text-red'} variant="xs" weight={500}>
                {liquidity1dChange > 0 ? '+' : '-'}
                {formatPercent(Math.abs(liquidity1dChange))}
              </Typography>
            )
          : null}
      </div>
      {!isSinglePool && (
        <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
          <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
            <Trans>Volume (24h)</Trans>
          </Typography>
          <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
            {formatUSD(pool.volume1d)}
          </Typography>
          {volume1dChange
            ? (
                <Typography className={volume1dChange > 0 ? 'text-green-600 dark:text-green' : 'text-red'} variant="xs" weight={500}>
                  {volume1dChange > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(volume1dChange))}
                </Typography>
              )
            : null}
        </div>
      )}
      {!isSinglePool && (
        <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
          <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
            <Trans>Fees (24h)</Trans>
          </Typography>
          <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
            {formatUSD(pool.fees1d)}
          </Typography>
          {volume1dChange
            ? (
                <Typography className={volume1dChange > 0 ? 'text-green-600 dark:text-green' : 'text-red'} variant="xs" weight={500}>
                  {volume1dChange > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(volume1dChange))}
                </Typography>
              )
            : null}
        </div>
      )}
    </div>
  )
}
