import { chainName } from '@zenlink-interface/chain'
import { formatFullNumber, formatPercent } from '@zenlink-interface/format'
import { useZLKStats } from '@zenlink-interface/shared'
import { Typography } from '@zenlink-interface/ui'
import type { EChartsOption } from 'echarts-for-react'
import type { FC } from 'react'
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config.js'
import { RateDesc } from './InitialIcon'

const tailwind = resolveConfig(tailwindConfig) as any

const COLORS = [
  '#FF1995FF',
  '#975CF5FF',
  '#01A3EEFF',
  '#6BDF9EFF',
  '#F3E500FF',
  '#FF733EFF',
]

export const CirculatingDistribution: FC = () => {
  const { data: stats, isLoading, isError } = useZLKStats()

  const totalStats = useMemo(
    () => (stats || []).reduce((total, { totalTvlUSD, totalVolumeUSD, holders, totalDistribute, totalBurn }) => {
      total.totalTvl = total.totalTvl + Number(totalTvlUSD)
      total.totalVolume = total.totalVolume + Number(totalVolumeUSD)
      total.totalHolders = total.totalHolders + holders
      total.totalCirculatingSupply = total.totalCirculatingSupply + Number(totalDistribute)
      total.totalBurn = total.totalBurn + Number(totalBurn)
      return total
    }, {
      totalTvl: 0,
      totalVolume: 0,
      totalHolders: 0,
      totalCirculatingSupply: 0,
      totalBurn: 0,
      totalMarketCap: 0,
    }),
    [stats],
  )

  const data = useMemo(() => (stats ?? []).map(s => ({
    amount: Number((s.totalDistribute)) / (10 ** 18),
    chainName: chainName[Number(s.chainId)],
    percent: formatPercent(Number(s.totalDistribute) / totalStats.totalCirculatingSupply),
  })), [stats, totalStats.totalCirculatingSupply])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      title: {
        text: 'Circulating Supply',
        subtext: `${formatFullNumber(totalStats.totalCirculatingSupply / (10 ** 18))}`,
        left: 'center',
        top: 'center',
        textStyle: {
          color: tailwind.theme.colors.slate['50'],
          fontSize: 16,
        },
        subtextStyle: {
          color: tailwind.theme.colors.slate['50'],
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: tailwind.theme.colors.slate['700'],
        textStyle: {
          color: tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-50 font-bold">${formatFullNumber(params.data.value)}</span>
            <span class="text-xs text-slate-400 font-medium">${params.data.name}</span>
          </div>`
        },
        borderWidth: 0,
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: {
        name: 'CirculatingDistribution',
        tooltip: {
          trigger: 'item',
        },
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: data.map(({ amount, chainName }, index) => ({
          name: chainName,
          value: amount,
          itemStyle: {
            color: COLORS[index % COLORS.length],
          },
        })),
        label: {
          color: tailwind.theme.colors.slate['50'],
        },
        itemStyle: {
          borderColor: tailwind.theme.colors.black['50'],
          borderWidth: 1,
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay() {
          return Math.random() * 200
        },
      },
    }),
    [data, totalStats.totalCirculatingSupply],
  )

  return (
    <>
      {(isLoading || isError)
        ? <div className=" h-full bg-slate-700 animate-pulse w-full rounded-md" />
        : (
          <section>
            <Typography weight={600}>Circulating Distribution</Typography>
            <div className="h-80">
              <ReactECharts option={DEFAULT_OPTION} style={{ height: 320 }} />
            </div>
            <div>
              <div className="h-40 flex items-center justify-center">
                <div className="flex flex-col text-white text-sm gap-0.5">
                  {data.map((d, index) => (
                    <RateDesc
                      color={COLORS[index % COLORS.length]}
                      key={d.chainName}
                      title={d.chainName}
                      desc={`${formatFullNumber(d.amount)} (${d.percent})`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          )}
    </>
  )
}
