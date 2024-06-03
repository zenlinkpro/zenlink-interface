import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { formatUSD } from '@zenlink-interface/format'
import type { CellProps } from './types'

export const UnderlyingAPYCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()

  const underlyingAPY = Number.parseFloat(
    ((marketsGraphDataMap[row.address.toLowerCase()]?.underlyingAPY || 0) * 100).toFixed(2),
  )

  const underlyingPrice = formatUSD(marketsGraphDataMap[row.address.toLowerCase()]?.sy.baseAsset.priceUSD)

  return (
    <div className="flex flex-col">
      <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
        {underlyingAPY}%
      </Typography>
      <Typography className="text-right text-slate-500 dark:text-slate-400" variant="sm" weight={600}>
        {underlyingPrice}
      </Typography>
    </div>
  )
}
