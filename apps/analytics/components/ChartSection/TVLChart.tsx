import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { formatUSD } from '@zenlink-interface/format'
import resolveConfig from 'tailwindcss/resolveConfig'
import { Typography, classNames } from '@zenlink-interface/ui'
import type { EChartsOption } from 'echarts-for-react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { Trans, t } from '@lingui/macro'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig) as any

enum TvlChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<TvlChartPeriod, number> = {
  [TvlChartPeriod.Day]: 86400 * 1000,
  [TvlChartPeriod.Week]: 604800 * 1000,
  [TvlChartPeriod.Month]: 2629746 * 1000,
  [TvlChartPeriod.Year]: 31556952 * 1000,
  [TvlChartPeriod.All]: Number.POSITIVE_INFINITY,
}

export const TVLChart: FC<{ x: number[]; y: number[] }> = ({ x, y }) => {
  const [chartPeriod, setChartPeriod] = useState<TvlChartPeriod>(TvlChartPeriod.Month)
  const { theme } = useTheme()

  const [xData, yData] = useMemo(() => {
    const currentDate = Math.round(Date.now())
    const predicates = x?.map(x => x * 1000 >= currentDate - chartTimespans[chartPeriod])
    return [x?.filter((_, i) => predicates[i]).reverse(), y?.filter((_, i) => predicates[i]).reverse()]
  }, [chartPeriod, x, y])

  // Transient update for performance
  const onMouseOver = useCallback(({ name, value }: { name: number; value: number }) => {
    const valueNodes = document.getElementsByClassName('hoveredItemValueTVL')
    const nameNodes = document.getElementsByClassName('hoveredItemNameTVL')

    valueNodes[0].innerHTML = formatUSD(value)
    nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
  }, [])

  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: isLightTheme ? tailwind.theme.colors.slate['300'] : tailwind.theme.colors.slate['700'],
        textStyle: {
          color: isLightTheme ? tailwind.theme.colors.slate['900'] : tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-900 dark:text-slate-50 font-bold">${formatUSD(params[0].value)}</span>
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
        color: [tailwind.theme.colors.blue['500']],
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
          name: t`TVL`,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            color: tailwind.theme.colors.blue['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate(idx: number) {
            return idx * 2
          },
          data: yData,
        },
      ],
    }),
    [isLightTheme, onMouseOver, xData, yData],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className={'pb-2 font-semibold text-sm'}><Trans>TVL</Trans></div>
        <div className="flex gap-4">
          <button
            onClick={() => setChartPeriod(TvlChartPeriod.Week)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === TvlChartPeriod.Week ? 'text-blue' : 'text-slate-500',
            )}
          >
            1W
          </button>
          <button
            onClick={() => setChartPeriod(TvlChartPeriod.Month)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === TvlChartPeriod.Month ? 'text-blue' : 'text-slate-500',
            )}
          >
            1M
          </button>
          <button
            onClick={() => setChartPeriod(TvlChartPeriod.Year)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === TvlChartPeriod.Year ? 'text-blue' : 'text-slate-500',
            )}
          >
            1Y
          </button>
          <button
            onClick={() => setChartPeriod(TvlChartPeriod.All)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === TvlChartPeriod.All ? 'text-blue' : 'text-slate-500',
            )}
          >
            ALL
          </button>
        </div>
      </div>
      <div className="flex flex-col h-[48px]">
        {yData && yData.length && (
          <Typography variant="xl" weight={500} className="text-slate-900 dark:text-slate-50">
            <span className="hoveredItemValueTVL">{formatUSD(yData[yData.length - 1])}</span>{' '}
          </Typography>
        )}
        {xData && xData.length && (
          <Typography variant="sm" className="text-slate-500 hoveredItemNameTVL">
            {format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}
          </Typography>
        )}
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 320 }} />
    </div>
  )
}
