import type { FC } from 'react'
import type { CellProps } from './types'

import { formatUSD } from '@zenlink-interface/format'
import { Typography } from '@zenlink-interface/ui'
import { useMarketFilters } from 'components'

export const MarketLiquidityCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()
  const liquidity = formatUSD(marketsGraphDataMap[row.address.toLowerCase()]?.reserveUSD)

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {liquidity.includes('NaN') ? '$0.00' : liquidity}
    </Typography>
  )
}
