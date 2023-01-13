import { NetworkIcon } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { ICON_SIZE } from '../../constants'
import type { CellProps } from './types'

export const PairChainCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon type="naked" chainId={row.chainId} width={ICON_SIZE} height={ICON_SIZE} />
    </div>
  )
}
