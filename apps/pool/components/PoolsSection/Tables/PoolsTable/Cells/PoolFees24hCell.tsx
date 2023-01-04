import { formatUSD } from '@zenlink-interface/format'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import type { CellProps } from './types'

export const PoolFees24hCell: FC<CellProps> = ({ row }) => {
  const volume = formatUSD(Number(row.poolDayData[1]?.dailyVolumeUSD || 0) * (row.type === POOL_TYPE.STANDARD_POOL ? 0.0015 : 0.00025))

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
