import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { formatDistanceToNow } from 'date-fns'

import { getMaturityFormatDate } from '@zenlink-interface/market'
import type { CellProps } from './types'

export const MarketMaturityCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="flex flex-col items-end">
        <Typography className="flex items-center gap-1 text-slate-900 dark:text-slate-50" variant="sm" weight={500}>
          {getMaturityFormatDate(row)}
        </Typography>
        <Typography className="text-slate-600 dark:text-slate-400" variant="xxs">
          {formatDistanceToNow(Number(row.expiry.toString()) * 1000)}
        </Typography>
      </div>
    </div>
  )
}
