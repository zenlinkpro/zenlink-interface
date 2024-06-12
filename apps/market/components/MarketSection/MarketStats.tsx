import { Trans } from '@lingui/macro'
import { formatPercent, formatUSD } from '@zenlink-interface/format'
import type { MarketGraphData } from '@zenlink-interface/graph-client'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo } from 'react'

interface MarketStatsProps {
  market: MarketGraphData | undefined
}

export const MarketStats: FC<MarketStatsProps> = ({ market }) => {
  const liquidity1dChange = useMemo(() => {
    const currentLiquidity = market?.marketDayData[0]?.reserveUSD
    const prevLiquidity = market?.marketDayData[1]?.reserveUSD

    return currentLiquidity && prevLiquidity && prevLiquidity > 0
      ? (currentLiquidity - prevLiquidity) / prevLiquidity
      : null
  }, [market?.marketDayData])

  const volume1d = useMemo(() => {
    const currentHourIndex = Number.parseInt((new Date().getTime() / 3600000).toString(), 10)
    const hourStartUnix1d = Number(currentHourIndex - 24) * 3600000
    return market?.marketHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix1d)
      .reduce((volume, { hourlyVolumeUSD }) => volume + hourlyVolumeUSD, 0)
  }, [market?.marketHourData])

  const volume1dChange = useMemo(() => {
    const currentHourIndex = Number.parseInt((new Date().getTime() / 3600000).toString(), 10)
    const hourStartUnix1d = Number(currentHourIndex - 24) * 3600000
    const hourStartUnix2d = Number(currentHourIndex - 48) * 3600000
    const volume2d = market?.marketHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix2d && Number(hourData.hourStartUnix) < hourStartUnix1d)
      .reduce((volume, { hourlyVolumeUSD }) => volume + hourlyVolumeUSD, 0)

    return volume1d && volume2d && volume2d > 0
      ? (volume1d - volume2d) / volume2d
      : null
  }, [market?.marketHourData, volume1d])

  const impliedAPY1dChange = useMemo(() => {
    const currentImpliedAPY = market?.marketDayData[0]?.impliedAPY || 0
    const prevImpliedAPY = market?.marketDayData[1]?.impliedAPY || 0

    return currentImpliedAPY && prevImpliedAPY && prevImpliedAPY > 0
      ? (currentImpliedAPY - prevImpliedAPY) / prevImpliedAPY
      : null
  }, [market?.marketDayData])

  const underlyingAPY1dChange = useMemo(() => {
    const currentUnderlyingAPY = market?.marketDayData[0]?.underlyingAPY || 0
    const prevUnderlyingAPY = market?.marketDayData[1]?.underlyingAPY || 0

    return currentUnderlyingAPY && prevUnderlyingAPY && prevUnderlyingAPY > 0
      ? (currentUnderlyingAPY - prevUnderlyingAPY) / prevUnderlyingAPY
      : null
  }, [market?.marketDayData])

  if (!market)
    return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
          <Trans>Liquidity</Trans>
        </Typography>
        <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
          {formatUSD(market.reserveUSD)}
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
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
          <Trans>Volume (24h)</Trans>
        </Typography>
        <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
          {formatUSD(volume1d || 0)}
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
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
          <Trans>Implied APY (24h)</Trans>
        </Typography>
        <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
          {formatPercent(market.impliedAPY || 0)}
        </Typography>
        {impliedAPY1dChange
          ? (
            <Typography className={impliedAPY1dChange > 0 ? 'text-green-600 dark:text-green' : 'text-red'} variant="xs" weight={500}>
              {impliedAPY1dChange > 0 ? '+' : '-'}
              {formatPercent(Math.abs(impliedAPY1dChange))}
            </Typography>
            )
          : null}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shadow-white/20 dark:shadow-black/20">
        <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
          <Trans>Underlying APY (24h)</Trans>
        </Typography>
        <Typography className="text-slate-900 dark:text-slate-50" weight={500}>
          {formatPercent(market.underlyingAPY || 0)}
        </Typography>
        {underlyingAPY1dChange
          ? (
            <Typography className={underlyingAPY1dChange > 0 ? 'text-green-600 dark:text-green' : 'text-red'} variant="xs" weight={500}>
              {underlyingAPY1dChange > 0 ? '+' : '-'}
              {formatPercent(Math.abs(underlyingAPY1dChange))}
            </Typography>
            )
          : null}
      </div>
    </div>
  )
}
