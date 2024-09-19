import type { FC } from 'react'
import type { CellProps } from './types'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { Typography } from '@zenlink-interface/ui'

export const PositionSizeCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center">
      <Typography
        className="text-slate-800 dark:text-slate-200 flex gap-2 items-center"
        variant="sm"
        weight={500}
      >
        {row.positionSize}
        {row.highlighted && <CheckBadgeIcon className="text-blue" height={18} width={18} />}
      </Typography>
    </div>
  )
}
