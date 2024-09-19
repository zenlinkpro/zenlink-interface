import type { AggregatorTrade, RouteLeg } from '@zenlink-interface/amm'
import type { FC } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig) as any

interface SankeyLink {
  source: string
  target: string
  value: number
  lineStyle?: {
    color?: string
    opacity?: number
  }
  poolName: string
  assumedAmountIn: number
  assumedAmountOut: number
}

interface SankeyParamsFormatter {
  dataType: string
  data: {
    target: string
    poolName: string
    source: string
    value: string
  }
}

const COLORS = [
  '#dd424c',
  '#43d6ad',
  '#425aea',
  '#e44588',
  '#fbc025',
  '#5b4aec',
  '#1f8aeb',
  '#f9930e',
  '#c0db4a',
  '#a348e2',
]

export const Sankey: FC<{ trade: AggregatorTrade }> = ({ trade }) => {
  const { theme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const options = useMemo(() => {
    const data = getData(trade.routeLegs)
    const links = getLinks(trade.routeLegs)

    return {
      series: [
        {
          data,
          draggable: false,
          emphasis: {
            disabled: true,
          },
          itemStyle: {
            borderWidth: 1,
            color: '#1e4560',
            shadowBlur: 5,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
          label: {
            color: 'inherit',
            position: 'inside',
            show: true,
          },
          links,
          nodeWidth: 30,
          right: '5%',
          type: 'sankey',
        },
      ],
      tooltip: {
        backgroundColor: isLightTheme ? tailwind.theme.colors.slate['50'] : tailwind.theme.colors.slate['700'],
        formatter: (params: SankeyParamsFormatter) => {
          if (params.dataType === 'node')
            return

          return `<div class="flex flex-col gap-0.5">
            <span>${params.data.poolName} ${Number(params.data.value).toFixed(0)}%</span>
            <span class="flex items-center gap-0.5">
              ${params.data.source}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
              ${params.data.target}
            </span>
          </div>`
        },
        position: [10, 10],
        textStyle: {
          color: isLightTheme ? tailwind.theme.colors.slate['900'] : tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        trigger: 'item',
        triggerOn: 'mousemove',
      },
    }
  }, [isLightTheme, trade.routeLegs])

  return <ReactECharts option={options} style={{ height: '240px', width: '400px' }} />
}

function getData(legs: RouteLeg[]): { name: string }[] {
  return legs.flatMap(leg => [
    { name: leg.tokenFrom.symbol },
    { name: leg.tokenTo.symbol },
  ]).filter((val, idx, arr) => arr.findIndex(t => (t.name === val.name)) === idx)
}

function getLinks(legs: RouteLeg[]): SankeyLink[] {
  const tokenValue = new Map<string | undefined, number>()
  tokenValue.set(legs?.[0]?.tokenFrom?.tokenId, 100)

  return legs?.reduce((links: SankeyLink[], leg: RouteLeg, i) => {
    const fromValue = tokenValue.get(leg.tokenFrom.tokenId) || 0
    const legValue = fromValue * leg.absolutePortion
    const value = Math.round(fromValue * leg.absolutePortion)

    const link: SankeyLink = {
      assumedAmountIn: leg.assumedAmountIn,
      assumedAmountOut: leg.assumedAmountOut,
      lineStyle: {
        color: COLORS[i % COLORS.length],
        opacity: 0.7,
      },
      poolName: leg.protocol ?? '',
      source: leg.tokenFrom.symbol,
      target: leg.tokenTo.symbol,
      value,
    }

    const toValue = tokenValue.get(leg.tokenTo.tokenId) || 0
    tokenValue.set(leg.tokenTo.tokenId, toValue + legValue)

    return [...links, link]
  }, [])
}
