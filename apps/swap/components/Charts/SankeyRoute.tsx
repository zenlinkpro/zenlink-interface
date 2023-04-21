import type { AggregatorTrade, RouteLeg } from '@zenlink-interface/amm'
import type { FC } from 'react'
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig) as any

interface SankeyLink {
  source: string
  target: string
  value: number
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

export const Sankey: FC<{ trade: AggregatorTrade }> = ({ trade }) => {
  const { theme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const options = useMemo(() => {
    const data = getData(trade.routeLegs)
    const links = getLinks(trade.routeLegs)

    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: isLightTheme ? tailwind.theme.colors.white : tailwind.theme.colors.slate['700'],
        textStyle: {
          color: isLightTheme ? tailwind.theme.colors.slate['900'] : tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: SankeyParamsFormatter) => {
          if (params.dataType === 'node')
            return
          return `${Number(params.data.value).toFixed(2)}% ${params.data.source}/${params.data.target} ${params.data.poolName}`
        },
      },
      series: [
        {
          type: 'sankey',
          data,
          links,
          label: {
            show: true,
            color: isLightTheme ? '#000000' : '#ffffff',
          },
          draggable: false,
          emphasis: {
            focus: 'adjacency',
          },
          itemStyle: {
            borderWidth: 1,
          },
          lineStyle: {
            color: 'source',
            curveness: 0.5,
          },
        },
      ],
    }
  }, [isLightTheme, trade.routeLegs])

  return <ReactECharts option={options} style={{ minWidth: 360, height: 240 }} />
}

function getData(legs: RouteLeg[]): { name: string }[] {
  return legs.flatMap(leg => [
    { name: leg.tokenFrom.symbol },
    { name: leg.tokenTo.symbol },
  ]).filter((val, idx, arr) => arr.findIndex(t => (t.name === val.name)) === idx)
}

function getLinks(legs: RouteLeg[]): SankeyLink[] {
  const tokenValue = new Map()
  tokenValue.set(legs?.[0]?.tokenFrom?.tokenId, 100)

  return legs?.reduce((links: SankeyLink[], leg: RouteLeg) => {
    const fromValue = tokenValue.get(leg.tokenFrom.tokenId) || 0
    const legValue = fromValue * leg.absolutePortion
    const value = Math.round(fromValue * leg.absolutePortion)

    const link: SankeyLink = {
      source: leg.tokenFrom.symbol,
      target: leg.tokenTo.symbol,
      value,
      poolName: leg.protocol ?? '',
      assumedAmountIn: leg.assumedAmountIn,
      assumedAmountOut: leg.assumedAmountOut,
    }

    const toValue = tokenValue.get(leg.tokenTo.tokenId) || 0
    tokenValue.set(leg.tokenTo.tokenId, toValue + legValue)

    return [...links, link]
  }, [])
}
