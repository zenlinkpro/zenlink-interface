import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { formatPercent, formatUSD } from '@zenlink-interface/format'
import { useMarketFilters } from 'components'
import type { CellProps } from './types'

export const LongYieldROICell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()

  const longYieldROI = formatPercent(marketsGraphDataMap[row.address.toLowerCase()]?.longYieldROI || 0)
  const ytPrice = formatUSD(marketsGraphDataMap[row.address.toLowerCase()]?.yt.priceUSD)

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <div className="w-full px-3 py-1 rounded-lg flex justify-between items-center bg-blue-400/30">
      <Typography className="text-right text-blue-600 dark:text-blue-300" variant="sm" weight={600}>
        YT
      </Typography>
      <div className="flex flex-col">
        <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
          {longYieldROI}
        </Typography>
        <Typography className="text-right text-slate-600 dark:text-slate-300" variant="sm" weight={600}>
          {ytPrice}
        </Typography>
      </div>
    </div>
  )
}
