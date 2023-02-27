import { formatUSD } from '@zenlink-interface/format'
import { format } from 'date-fns'
import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import { Typography, classNames } from '@zenlink-interface/ui'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig) as any

enum VolumeChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<VolumeChartPeriod, number> = {
  [VolumeChartPeriod.Day]: 86400 * 1000,
  [VolumeChartPeriod.Week]: 604800 * 1000,
  [VolumeChartPeriod.Month]: 2629746 * 1000,
  [VolumeChartPeriod.Year]: 31556952 * 1000,
  [VolumeChartPeriod.All]: Infinity,
}

export const VolumeChart: FC<{ x: number[]; y: number[] }> = ({ x, y }) => {
  const [chartPeriod, setChartPeriod] = useState<VolumeChartPeriod>(VolumeChartPeriod.Month)

  const [xData, yData] = useMemo(() => {
    const currentDate = Math.round(Date.now())
    const predicates = x?.map(x => x * 1000 >= currentDate - chartTimespans[chartPeriod])
    return [x?.filter((_, i) => predicates[i]).reverse(), y?.filter((_, i) => predicates[i]).reverse()]
  }, [chartPeriod, x, y])

  // Transient update for performance
  const onMouseOver = useCallback(({ name, value }: { name: number; value: number }) => {
    const valueNodes = document.getElementsByClassName('hoveredItemValueVolume')
    const nameNodes = document.getElementsByClassName('hoveredItemNameVolume')

    valueNodes[0].innerHTML = formatUSD(value)
    nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
  }, [])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: tailwind.theme.colors.slate['700'],
        textStyle: {
          color: tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-50 font-bold">${formatUSD(params[0].value)}</span>
            <span class="text-xs text-slate-400 font-medium">${
              date instanceof Date && !isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
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
          name: 'Volume',
          type: 'bar',
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
    [onMouseOver, xData, yData],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className={classNames('pb-2 font-semibold text-sm')}>Volume</div>
        <div className="flex gap-4">
          <button
            onClick={() => setChartPeriod(VolumeChartPeriod.Week)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.Week ? 'text-blue' : 'text-slate-500',
            )}
          >
            1W
          </button>
          <button
            onClick={() => setChartPeriod(VolumeChartPeriod.Month)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.Month ? 'text-blue' : 'text-slate-500',
            )}
          >
            1M
          </button>
          <button
            onClick={() => setChartPeriod(VolumeChartPeriod.Year)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.Year ? 'text-blue' : 'text-slate-500',
            )}
          >
            1Y
          </button>
          <button
            onClick={() => setChartPeriod(VolumeChartPeriod.All)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.All ? 'text-blue' : 'text-slate-500',
            )}
          >
            ALL
          </button>
        </div>
      </div>
      <div className="flex flex-col h-[48px]">
        {yData && yData.length && (
          <Typography variant="xl" weight={500} className="text-slate-50">
            <span className="hoveredItemValueVolume">{formatUSD(yData[yData.length - 1])}</span>{' '}
          </Typography>
        )}
        {xData && xData.length && (
          <Typography variant="sm" className="text-slate-500 hoveredItemNameVolume">
            {format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}
          </Typography>
        )}
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 320 }} />
    </div>
  )
}
