import { formatUSD } from '@zenlink-interface/format'
import { format, getUnixTime } from 'date-fns'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import { AppearOnMount, Typography, classNames } from '@zenlink-interface/ui'
import ReactECharts from 'echarts-for-react'
import type { Pool } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { useTheme } from 'next-themes'
import { Trans } from '@lingui/macro'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig) as any

interface PoolChartProps {
  pool: Pool
}

enum PoolChartType {
  Volume,
  TVL,
  Fees,
}

enum PoolChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<PoolChartPeriod, number> = {
  [PoolChartPeriod.Day]: 86400 * 1000,
  [PoolChartPeriod.Week]: 604800 * 1000,
  [PoolChartPeriod.Month]: 2629746 * 1000,
  [PoolChartPeriod.Year]: 31556952 * 1000,
  [PoolChartPeriod.All]: Number.POSITIVE_INFINITY,
}

export const PoolChart: FC<PoolChartProps> = ({ pool }) => {
  const { theme } = useTheme()
  const [chartType, setChartType] = useState<PoolChartType>(PoolChartType.Volume)

  const isSignlePool = pool.type === POOL_TYPE.SINGLE_TOKEN_POOL

  useEffect(() => {
    if (isSignlePool)
      setChartType(PoolChartType.TVL)
  }, [isSignlePool])

  const [chartPeriod, setChartPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Week)
  const [xData, yData] = useMemo(() => {
    const toUseHourData = chartTimespans[chartPeriod] <= chartTimespans[PoolChartPeriod.Week]
    const hourData = toUseHourData ? pool.poolHourData : []
    const dayData = toUseHourData ? [] : pool.poolDayData
    const currentDate = Math.round(Date.now())

    const [xHour, yHour] = hourData.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (Number(cur.hourStartUnix) >= currentDate - chartTimespans[chartPeriod]) {
          acc[0].push(Number(cur.hourStartUnix) / 1000)
          if (chartType === PoolChartType.Fees)
            acc[1].push(Number(cur.hourlyVolumeUSD) * pool.swapFee)
          else if (chartType === PoolChartType.Volume)
            acc[1].push(Number(cur.hourlyVolumeUSD))
          else if (chartType === PoolChartType.TVL)
            acc[1].push(Number(cur.reserveUSD))
        }
        return acc
      },
      [[], []],
    )

    const [xDay, yDay] = dayData.reduce<[number[], number[]]>(
      (acc, cur) => {
        const date = getUnixTime(new Date(cur.date))
        if (date * 1000 >= currentDate - chartTimespans[chartPeriod]) {
          acc[0].push(date)
          if (chartType === PoolChartType.Fees)
            acc[1].push(Number(cur.dailyVolumeUSD) * pool.swapFee)
          else if (chartType === PoolChartType.Volume)
            acc[1].push(Number(cur.dailyVolumeUSD))
          else if (chartType === PoolChartType.TVL)
            acc[1].push(Number(cur.reserveUSD))
        }
        return acc
      },
      [[], []],
    )

    return xHour.length ? [xHour.reverse(), yHour.reverse()] : [xDay.reverse(), yDay.reverse()]
  }, [chartPeriod, chartType, pool.poolDayData, pool.poolHourData, pool.swapFee])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      valueNodes[0].innerHTML = formatUSD(value)

      if (chartType === PoolChartType.Volume)
        valueNodes[1].innerHTML = formatUSD(value * pool.swapFee)

      nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
    },
    [chartType, pool.swapFee],
  )

  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: isLightTheme
          ? tailwind.theme?.colors?.slate['300']
          : tailwind.theme?.colors?.slate['700'],
        textStyle: {
          color: tailwind.theme?.colors?.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-900 dark:text-slate-50 font-semibold">${formatUSD(params[0].value)
            }</span>
            <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">${date instanceof Date && !Number.isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
            }</span>
          </div>`
        },
        borderWidth: 0,
      },
      toolbox: {
        show: false,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100,
      },
      visualMap: {
        show: false,
        color: [tailwind.theme?.colors?.blue['500']],
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          boundaryGap: true,
          data: xData,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          scale: true,
          name: 'Volume',
          max: 'dataMax',
          min: 'dataMin',
        },
      ],
      series: [
        {
          name: 'Volume',
          type: chartType === PoolChartType.TVL ? 'line' : 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            color: tailwind.theme?.colors?.blue['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate(idx: number) {
            return idx * 2
          },
          data: yData,
        },
      ],
    }),
    [isLightTheme, xData, chartType, yData, onMouseOver],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex gap-6">
          {!isSignlePool && (
            <button
              onClick={() => setChartType(PoolChartType.Volume)}
              className={classNames(
                'border-b-[3px] pb-2 font-semibold text-sm',
                chartType === PoolChartType.Volume ? 'text-slate-900 dark:text-slate-50 border-blue' : 'text-slate-500 border-transparent',
              )}
            >
              <Trans>Volume</Trans>
            </button>
          )}
          <button
            onClick={() => setChartType(PoolChartType.TVL)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === PoolChartType.TVL ? 'text-slate-900 dark:text-slate-50 border-blue' : 'text-slate-500 border-transparent',
            )}
          >
            <Trans>TVL</Trans>
          </button>
          {!isSignlePool && (
            <button
              onClick={() => setChartType(PoolChartType.Fees)}
              className={classNames(
                'border-b-[3px] pb-2 font-semibold text-sm',
                chartType === PoolChartType.Fees ? 'text-slate-900 dark:text-slate-50 border-blue' : 'text-slate-500 border-transparent',
              )}
            >
              <Trans>Fees</Trans>
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Day)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Day ? 'text-blue' : 'text-slate-500',
            )}
          >
            1D
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Week)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Week ? 'text-blue' : 'text-slate-500',
            )}
          >
            1W
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Month)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Month ? 'text-blue' : 'text-slate-500',
            )}
          >
            1M
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Year)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Year ? 'text-blue' : 'text-slate-500',
            )}
          >
            1Y
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.All)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.All ? 'text-blue' : 'text-slate-500',
            )}
          >
            ALL
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <Typography variant="xl" weight={500} className="text-slate-900 dark:text-slate-50">
          <span className="hoveredItemValue">
            {formatUSD(yData[yData.length - 1])}
          </span>{' '}
          {chartType === PoolChartType.Volume && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="text-xs top-[-2px] relative">•</span>{' '}
              <span className="hoveredItemValue">{formatUSD(yData[yData.length - 1] * pool.swapFee)}</span>{' '}
              earned
            </span>
          )}
        </Typography>
        {xData.length && (
          <Typography variant="sm" className="text-slate-500 hoveredItemName">
            <AppearOnMount>{format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}</AppearOnMount>
          </Typography>
        )}
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 400 }} />
    </div>
  )
}
