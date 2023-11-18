import { formatUSD } from '@zenlink-interface/format'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import type { CellProps } from './types'

export const PoolFees7dCell: FC<CellProps> = ({ row }) => {
  const volume = formatUSD(row.fees7d)

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
