import { Currency, NetworkIcon, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { format } from 'date-fns'
import { ICON_SIZE } from '../../constants'

import type { CellProps } from './types'

export const MarketNameCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="hidden sm:flex">
      <div className="mr-[26px]">
        <Currency.Icon currency={row} disableLink height={ICON_SIZE} width={ICON_SIZE} />
      </div>
      </div>
      <div className="flex sm:hidden">
        <NetworkIcon chainId={row.chainId} height={ICON_SIZE} width={16} />
      </div>
      <div className="flex flex-col">
        <Typography className="flex items-center gap-1 text-slate-900 dark:text-slate-50" variant="sm" weight={500}>
         {row.name}
        </Typography>
        <Typography className="text-slate-600 dark:text-slate-400" variant="xxs">
          {format(Number(row.expiry.toString()) * 1000, 'dd MMM yyyy')}
        </Typography>
      </div>
    </div>
  )
}
