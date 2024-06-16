import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { formatPercent, formatUSD } from '@zenlink-interface/format'
import type { CellProps } from './types'

export const FixedROICell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()

  const fixedROI = formatPercent(marketsGraphDataMap[row.address.toLowerCase()]?.fixedROI || 0)
  const ptPrice = formatUSD(marketsGraphDataMap[row.address.toLowerCase()]?.pt.priceUSD)

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <div className="w-full px-3 py-1 rounded-lg flex justify-between items-center bg-green-600/30">
      <Typography className="text-right text-green-600 dark:text-green-300" variant="sm" weight={600}>
        PT
      </Typography>
      <div className="flex flex-col">
        <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
          {fixedROI}
        </Typography>
        <Typography className="text-right text-slate-600 dark:text-slate-300" variant="sm" weight={600}>
          {ptPrice}
        </Typography>
      </div>
    </div>
  )
}
