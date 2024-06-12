import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { formatUSD } from '@zenlink-interface/format'
import { useMarketFilters } from 'components'
import type { CellProps } from './types'

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
