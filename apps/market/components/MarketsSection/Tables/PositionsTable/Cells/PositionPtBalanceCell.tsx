import type { FC } from 'react'
import { Typography } from '@zenlink-interface/ui'
import { useMarketFilters } from 'components'
import { formatUSD } from '@zenlink-interface/format'
import type { CellProps } from './types'

export const PositionPtBalanceCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()

  const ptPrice = marketsGraphDataMap[row.id.toLowerCase()]?.pt.priceUSD || 0

  const ptBalanceUSD = formatUSD(Number((row.ptBalance?.toExact() || '0')) * ptPrice)

  return (
    <div className="flex flex-col">
      <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
        {row.ptBalance?.toSignificant(6) || '0'}
      </Typography>
      <Typography className="text-right text-slate-500 dark:text-slate-400" variant="sm" weight={600}>
        {ptBalanceUSD}
      </Typography>
    </div>
  )
}
