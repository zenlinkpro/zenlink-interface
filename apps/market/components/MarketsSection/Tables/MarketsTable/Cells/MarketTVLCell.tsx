import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { formatUSD } from '@zenlink-interface/format'
import type { CellProps } from './types'

export const MarketTVLCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()
  const tvl = formatUSD(marketsGraphDataMap[row.address.toLowerCase()]?.reserveUSD)

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}
