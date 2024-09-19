import type { FC } from 'react'
import type { CellProps } from './types'
import { Currency, Typography } from '@zenlink-interface/ui'

import { ICON_SIZE } from '../../constants'

export const PositionNameCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="flex">
        <div className="mr-1 sm:mr-4 flex items-center">
          <Currency.Icon currency={row.market.SY.yieldToken} disableLink height={ICON_SIZE} width={ICON_SIZE} />
        </div>
      </div>
      <div className="flex flex-col">
        <Typography className="text-slate-900 dark:text-slate-50" variant="base" weight={600}>
          {row.market.SY.yieldToken.symbol}
        </Typography>
        <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
          {row.market.projectName}
        </Typography>
      </div>
    </div>
  )
}
