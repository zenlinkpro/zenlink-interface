import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { useMarketFilters } from 'components/MarketsFiltersProvider'
import type { CellProps } from './types'

export const ImpliedAPYCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()

  const impliedAPY = Number.parseFloat(
    ((marketsGraphDataMap[row.address.toLowerCase()]?.impliedAPY || 0) * 100).toFixed(2),
  )

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {impliedAPY}%
    </Typography>
  )
}
