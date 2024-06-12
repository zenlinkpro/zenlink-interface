import type { FC } from 'react'
import { Typography } from '@zenlink-interface/ui'
import { useMarketFilters } from 'components'
import { formatUSD } from '@zenlink-interface/format'
import type { CellProps } from './types'

export const PositionLpBalanceCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()

  const lpPrice = marketsGraphDataMap[row.id.toLowerCase()]?.priceUSD || 0

  const lpBalanceUSD = formatUSD(Number((row.lpBalance?.toExact() || '0')) * lpPrice)

  return (
    <div className="flex flex-col">
      <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
        {row.lpBalance?.toSignificant(6) || '0'}
      </Typography>
      <Typography className="text-right text-slate-500 dark:text-slate-400" variant="sm" weight={600}>
        {lpBalanceUSD}
      </Typography>
    </div>
  )
}
