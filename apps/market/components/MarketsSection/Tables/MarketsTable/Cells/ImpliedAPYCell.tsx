import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { formatPercent } from '@zenlink-interface/format'
import type { CellProps } from './types'

export const ImpliedAPYCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()

  const impliedAPY = formatPercent(marketsGraphDataMap[row.address.toLowerCase()]?.impliedAPY || 0)

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {impliedAPY}
    </Typography>
  )
}
