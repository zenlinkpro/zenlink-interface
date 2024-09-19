import type { FC } from 'react'
import type { CellProps } from './types'

import { NetworkIcon } from '@zenlink-interface/ui'
import { ICON_SIZE } from './constants'

export const NetworkCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <NetworkIcon chainId={Number(row.chainId)} height={ICON_SIZE} width={ICON_SIZE} />
      </div>
    </div>
  )
}
