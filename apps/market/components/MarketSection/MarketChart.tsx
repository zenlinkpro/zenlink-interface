import { formatPercent, formatUSD } from '@zenlink-interface/format'
import type { MarketGraphData } from '@zenlink-interface/graph-client'
import { format, getUnixTime } from 'date-fns'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import resolveConfig from 'tailwindcss/resolveConfig'
import { AppearOnMount, Typography, classNames } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import ReactECharts from 'echarts-for-react'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig)

interface MarketChartProps {
  market: MarketGraphData | undefined
  isLoading: boolean
}

enum MarketChartType {
  APY,
  Liquidity,
  Volume,
}

enum MarketChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<MarketChartPeriod, number> = {
  [MarketChartPeriod.Day]: 86400 * 1000,
  [MarketChartPeriod.Week]: 604800 * 1000,
  [MarketChartPeriod.Month]: 2629746 * 1000,
  [MarketChartPeriod.Year]: 31556952 * 1000,
  [MarketChartPeriod.All]: Number.POSITIVE_INFINITY,
}

export const MarketChart: FC<MarketChartProps> = ({ market, isLoading }) => {
  const [chartType, setChartType] = useState<MarketChartType>(MarketChartType.Volume)
  const [chartPeriod, setChartPeriod] = useState<MarketChartPeriod>(MarketChartPeriod.Week)

  useEffect(() => {
    if (chartType === MarketChartType.APY)
      setChartPeriod(MarketChartPeriod.Week)
  }, [chartType])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex gap-6">
          <button
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === MarketChartType.Volume ? 'text-slate-900 dark:text-slate-50 border-blue' : 'text-slate-500 border-transparent',
            )}
            onClick={() => setChartType(MarketChartType.Volume)}
          >
            <Trans>Volume</Trans>
          </button>
          <button
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === MarketChartType.Liquidity ? 'text-slate-900 dark:text-slate-50 border-blue' : 'text-slate-500 border-transparent',
            )}
            onClick={() => setChartType(MarketChartType.Liquidity)}
          >
            <Trans>Liquidity</Trans>
          </button>
          <button
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === MarketChartType.APY ? 'text-slate-900 dark:text-slate-50 border-blue' : 'text-slate-500 border-transparent',
            )}
            onClick={() => setChartType(MarketChartType.APY)}
          >
            <Trans>APY</Trans>
          </button>
        </div>
        <div className="flex gap-4">
          {chartType !== MarketChartType.APY && (
            <button
              className={classNames(
                'font-semibold text-sm',
                chartPeriod === MarketChartPeriod.Day ? 'text-blue' : 'text-slate-500',
              )}
              onClick={() => setChartPeriod(MarketChartPeriod.Day)}
            >
              1D
            </button>
          )}
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Week ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(MarketChartPeriod.Week)}
          >
            1W
          </button>
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Month ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(MarketChartPeriod.Month)}
          >
            1M
          </button>
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Year ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(MarketChartPeriod.Year)}
          >
            1Y
          </button>
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.All ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(MarketChartPeriod.All)}
          >
            ALL
          </button>
        </div>
      </div>
      {
        chartType === MarketChartType.APY
          ? (
            <APYChart
              chartPeriod={chartPeriod}
              chartType={chartType}
              isLoading={isLoading}
              market={market}
            />
            )
          : (
            <LiquidityAndVolumeChart
              chartPeriod={chartPeriod}
              chartType={chartType}
              isLoading={isLoading}
              market={market}
            />
            )
      }

    </div>
  )
}

interface ChartProps {
  chartType: MarketChartType
  chartPeriod: MarketChartPeriod
  market: MarketGraphData | undefined
  isLoading: boolean
}

function APYChart({ chartPeriod, market }: ChartProps) {
  const { theme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const [xData, yData0, yData1] = useMemo(() => {
    const dayData = market?.marketDayData
    const currentDate = Math.round(Date.now())

    const [xDay, yDay0, yDay1] = (dayData || [])
      .filter(data => data.impliedAPY !== 0 && data.underlyingAPY !== 0)
      .reduce<[number[], number[], number[]]>(
        (acc, cur) => {
          const date = getUnixTime(new Date(cur.date))
          if (date * 1000 >= currentDate - chartTimespans[chartPeriod]) {
            acc[0].push(date)
            acc[1].push(cur.impliedAPY)
            acc[2].push(cur.underlyingAPY)
          }
          return acc
        },
        [[], [], []],
      )

    return [xDay.reverse(), yDay0.reverse(), yDay1.reverse()]
  }, [chartPeriod, market?.marketDayData])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value0, value1 }: { name: number, value0: number, value1: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      valueNodes[0].innerHTML = formatPercent(value0)
      valueNodes[1].innerHTML = formatPercent(value1)

      nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
    },
    [],
  )

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
          onMouseOver({ name: params[0].name, value0: params[0].value, value1: params[1].value })

          const date = new Date(Number(params[0].name * 1000))
          return `
            <div class="flex flex-col gap-0.5">
              <span class="text-sm text-green font-semibold">Implied APY: ${formatPercent(params[0].value)
            }</span>
            <span class="text-sm text-blue font-semibold">Underlying APY: ${formatPercent(params[1].value)
            }</span>
              <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">${date instanceof Date && !Number.isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
            }</span>
            </div>
          `
        },
        borderWidth: 0,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          boundaryGap: true,
          data: xData,
        },
      ],
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          name: 'Implied APY',
          type: 'line',
          color: tailwind.theme.colors.green[500],
          smooth: true,
          animationEasing: 'elasticOut',
          animationDelayUpdate(idx: number) {
            return idx * 2
          },
          data: yData0,
        },
        {
          name: 'Underlying APY',
          type: 'line',
          color: tailwind.theme.colors.blue[500],
          smooth: true,
          animationEasing: 'elasticOut',
          animationDelayUpdate(idx: number) {
            return idx * 2
          },
          data: yData1,
        },
      ],
    }),
    [isLightTheme, onMouseOver, xData, yData0, yData1],
  )

  const loadingOption = {
    text: '',
    maskColor: 'rgba(239, 246, 255, 0.2)',
    zlevel: 0,
  }

  return (
    <>
      {!!market && (
        <div className="flex flex-col">
          <div className="flex gap-2">
            <Typography className="text-green-500" variant="base" weight={500}>
              <Trans>Implied APY</Trans>:
              {' '}
              <span className="hoveredItemValue">
                {formatPercent(yData1[yData1.length - 1])}
              </span>
            </Typography>
            <Typography className="text-blue-500" variant="base" weight={500}>
              <Trans>Underlying APY</Trans>:
              {' '}
              <span className="hoveredItemValue">
                {formatPercent(yData1[yData1.length - 1])}
              </span>
            </Typography>
          </div>
          {xData.length && (
            <Typography className="text-slate-500 hoveredItemName" variant="sm">
              <AppearOnMount>{format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}</AppearOnMount>
            </Typography>
          )}
        </div>
      )}
      <ReactECharts
        loadingOption={loadingOption}
        option={DEFAULT_OPTION}
        showLoading={!market}
        style={{ height: 400 }}
      />
    </>
  )
}

function LiquidityAndVolumeChart({ chartType, chartPeriod, market }: ChartProps) {
  const { theme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const [xData, yData] = useMemo(() => {
    const toUseHourData = chartTimespans[chartPeriod] <= chartTimespans[MarketChartPeriod.Week]
    const hourData = toUseHourData ? market?.marketHourData : []
    const dayData = toUseHourData ? [] : market?.marketDayData
    const currentDate = Math.round(Date.now())

    const [xHour, yHour] = (hourData || []).reduce<[number[], number[]]>(
      (acc, cur) => {
        if (Number(cur.hourStartUnix) >= currentDate - chartTimespans[chartPeriod]) {
          acc[0].push(Number(cur.hourStartUnix) / 1000)
          if (chartType === MarketChartType.Liquidity)
            acc[1].push(cur.reserveUSD)
          else if (chartType === MarketChartType.Volume)
            acc[1].push(cur.hourlyVolumeUSD)
        }
        return acc
      },
      [[], []],
    )

    const [xDay, yDay] = (dayData || []).reduce<[number[], number[]]>(
      (acc, cur) => {
        const date = getUnixTime(new Date(cur.date))
        if (date * 1000 >= currentDate - chartTimespans[chartPeriod]) {
          acc[0].push(date)
          if (chartType === MarketChartType.Liquidity)
            acc[1].push(cur.reserveUSD)
          else if (chartType === MarketChartType.Volume)
            acc[1].push(cur.dailyVolumeUSD)
        }
        return acc
      },
      [[], []],
    )

    return xHour.length
      ? [xHour.reverse(), yHour.reverse()]
      : [xDay.reverse(), yDay.reverse()]
  }, [chartPeriod, chartType, market?.marketDayData, market?.marketHourData])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }: { name: number, value: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      valueNodes[0].innerHTML = formatUSD(value)

      nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
    },
    [],
  )

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
          return `
            <div class="flex flex-col gap-0.5">
              <span class="text-sm text-slate-900 dark:text-slate-50 font-semibold">${formatUSD(params[0].value)
            }</span>
              <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">${date instanceof Date && !Number.isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
            }</span>
            </div>
          `
        },
        borderWidth: 0,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          name: 'Volume',
          type: chartType === MarketChartType.Volume ? 'bar' : 'line',
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          smooth: true,
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

  const loadingOption = {
    text: '',
    maskColor: 'rgba(239, 246, 255, 0.2)',
    zlevel: 0,
  }

  return (
    <>
      {!!market && (
        <div className="flex flex-col">
          <Typography className="text-slate-900 dark:text-slate-50" variant="xl" weight={500}>
            <span className="hoveredItemValue">
              {formatUSD(yData[yData.length - 1])}
            </span>
          </Typography>
          {xData.length && (
            <Typography className="text-slate-500 hoveredItemName" variant="sm">
              <AppearOnMount>{format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}</AppearOnMount>
            </Typography>
          )}
        </div>
      )}
      <ReactECharts
        loadingOption={loadingOption}
        option={DEFAULT_OPTION}
        showLoading={!market}
        style={{ height: 400 }}
      />
    </>
  )
}
