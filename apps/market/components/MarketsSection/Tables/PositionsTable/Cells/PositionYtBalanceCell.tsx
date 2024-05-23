import type { FC } from 'react'
import { Typography } from '@zenlink-interface/ui'
import type { CellProps } from './types'

export const PositionYtBalanceCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {row.ytBalance?.toSignificant(6) || '0'}
    </Typography>
  )
}
