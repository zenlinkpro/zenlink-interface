import { NetworkIcon } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { ICON_SIZE } from '../../constants'
import type { CellProps } from './types'

export const PairChainCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon chainId={row.chainId} height={ICON_SIZE} type="naked" width={ICON_SIZE} />
    </div>
  )
}
