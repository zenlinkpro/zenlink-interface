import { Currency, NetworkIcon, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
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
          {row.SY.yieldToken.symbol}
        </Typography>
      </div>
    </div>
  )
}
