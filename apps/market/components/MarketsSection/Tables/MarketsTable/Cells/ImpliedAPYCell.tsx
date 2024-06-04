import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { useMarketFilters } from 'components/MarketsFiltersProvider'
import type { CellProps } from './types'

export const ImpliedAPYCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()

  const impliedAPY = Number.parseFloat(
    ((marketsGraphDataMap[row.address.toLowerCase()]?.impliedAPY || 0) * 100).toFixed(2),
  )

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {impliedAPY}%
    </Typography>
  )
}
