import type { FC } from 'react'
import type { CellProps } from './types'
import { Typography } from '@zenlink-interface/ui'

export const TierCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center">
      <Typography
        className="text-slate-800 dark:text-slate-200 flex gap-2 items-center"
        variant="sm"
        weight={500}
      >
        {row.tier}
      </Typography>
    </div>
  )
}
