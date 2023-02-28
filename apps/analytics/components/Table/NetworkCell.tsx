import { NetworkIcon } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { ICON_SIZE } from './constants'
import type { CellProps } from './types'

export const NetworkCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <NetworkIcon chainId={Number(row.chainId)} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
    </div>
  )
}
