import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import type { CellProps } from './types'

export const TierCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center">
      <Typography
        variant="sm"
        weight={500}
        className="text-slate-800 dark:text-slate-200 flex gap-2 items-center"
      >
        {row.tier}
      </Typography>
    </div>
  )
}
