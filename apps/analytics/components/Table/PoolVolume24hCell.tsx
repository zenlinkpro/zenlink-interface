import type { FC } from 'react'
import type { CellProps } from './types'
import { formatUSD } from '@zenlink-interface/format'

import { Typography } from '@zenlink-interface/ui'

export const PoolVolume24hCell: FC<CellProps> = ({ row }) => {
  const volume = formatUSD(row.volume1d)

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
