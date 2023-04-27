import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import type { CellProps } from './types'

export const PositionSizeCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center">
      <Typography
        variant="sm"
        weight={500}
        className="text-slate-800 dark:text-slate-200 flex gap-2 items-center"
      >
        {row.positionSize}
        {row.highlighted && <CheckBadgeIcon width={18} height={18} className="text-blue" />}
      </Typography>
    </div>
  )
}
