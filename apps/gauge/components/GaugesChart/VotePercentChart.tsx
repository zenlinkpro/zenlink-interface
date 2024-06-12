import { getMaturityFormatDate } from '@zenlink-interface/market'
import { Percent } from '@zenlink-interface/math'
import { Typography } from '@zenlink-interface/ui'
import { ChartMode, useGaugeVotes } from 'components'
import type { EChartsOption } from 'echarts-for-react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { type FC, useMemo } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig) as any

const COLORS = [
  '#FF1995FF',
  '#975CF5FF',
  '#01A3EEFF',
  '#6BDF9EFF',
  '#F3E500FF',
  '#FF733EFF',
  '#FF669DFF',
  '#FFF176FF',
]

export const VotePercentChart: FC = () => {
  const {
    chartMode,
    gauges,
    isLoading,
    voteInputMap,
    votedPercentMap,
    unusedVotePercent,
  } = useGaugeVotes()
  const { theme } = useTheme()

  const communityData = useMemo(() => {
    if (!gauges?.length)
      return []

    const sortedGauges = gauges.sort(
      (a, b) => a.communityVotedPercentage.greaterThan(b.communityVotedPercentage) ? -1 : 1,
    )
    const topGauges = sortedGauges.slice(0, 7)
    const otherGauges = sortedGauges.slice(7)

    return topGauges.map(gauge => ({
      name: `${gauge.market.SY.yieldToken.symbol} ${getMaturityFormatDate(gauge.market)}`,
      amount: Number(gauge.communityVotedPercentage.toSignificant(2)),
      color: '',
    })).concat({
      name: 'others',
      amount: Number(otherGauges.reduce(
        (total, gauge) => total.add(gauge.communityVotedPercentage),
        new Percent(0),
      ).toSignificant(2)),
      color: '',
    })
  }, [gauges])

  const myVoteData = useMemo(() => {
    if (!gauges?.length)
      return []

    const sortedGauges = gauges
      .filter(gauge => (voteInputMap[gauge.id] || votedPercentMap[gauge.id]).greaterThan(0))
      .sort(
        (a, b) => (voteInputMap[a.id] || votedPercentMap[a.id])
          .greaterThan((voteInputMap[b.id] || votedPercentMap[b.id]))
          ? -1
          : 1,
      )
    const topGauges = sortedGauges.slice(0, 7)
    const otherGauges = sortedGauges.slice(7)

    return topGauges.map(gauge => ({
      name: `${gauge.market.SY.yieldToken.symbol} ${getMaturityFormatDate(gauge.market)}`,
      amount: Number((voteInputMap[gauge.id] || votedPercentMap[gauge.id]).toSignificant(2)),
      color: '',
    })).concat([
      {
        name: 'others',
        amount: Number(otherGauges.reduce(
          (total, gauge) => total.add((voteInputMap[gauge.id] || votedPercentMap[gauge.id])),
          new Percent(0),
        ).toSignificant(2)),
        color: '',
      },
      {
        name: 'unused',
        amount: Number(unusedVotePercent.toSignificant(2)),
        color: 'gray',
      },
    ])
  }, [gauges, unusedVotePercent, voteInputMap, votedPercentMap])

  const isCommunityChart = chartMode === ChartMode.COMMUNITY_VOTE
  const data = useMemo(
    () => isCommunityChart ? communityData : myVoteData,
    [communityData, isCommunityChart, myVoteData],
  )

  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: isLightTheme ? tailwind.theme.colors.slate['300'] : tailwind.theme.colors.slate['700'],
        textStyle: {
          color: isLightTheme ? tailwind.theme.colors.slate['900'] : tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-900 dark:text-slate-50 font-bold">${params.data.value}%</span>
            <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">${params.data.name}</span>
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
        name: 'VotePercentChart',
        tooltip: {
          trigger: 'item',
        },
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: data.map(({ name, amount, color }, index) => ({
          name,
          value: amount,
          itemStyle: {
            color: color || COLORS[index % COLORS.length],
          },
        })),
        label: {
          color: isLightTheme ? tailwind.theme.colors.slate['900'] : tailwind.theme.colors.slate['50'],
        },
        itemStyle: {
          borderColor: tailwind.theme.colors.slate['50'],
          borderWidth: 1,
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay() {
          return Math.random() * 200
        },
      },
    }),
    [data, isLightTheme],
  )

  return (
    <>
      {isLoading
        ? <div className="h-full bg-slate-300 dark:bg-slate-700 animate-pulse w-full rounded-md" />
        : (
          <section>
            <div className="h-80">
              <ReactECharts option={DEFAULT_OPTION} style={{ height: 320 }} />
            </div>
            <div className="flex flex-col text-black dark:text-white text-sm gap-1 w-full p-8 mt-4">
              {data.map((data, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <Typography style={{ color: data.color || COLORS[index % COLORS.length] }} variant="sm" weight={600}>
                    {data.name}
                  </Typography>
                  <Typography variant="sm" weight={600}>
                    {data.amount}%
                  </Typography>
                </div>
              ))}
            </div>
          </section>
          )}
    </>
  )
}
