import { formatUSD } from '@zenlink-interface/format'
import { useInViewport } from '@zenlink-interface/hooks'
import { Typography } from '@zenlink-interface/ui'
import { PoolPositionProvider } from 'components/PoolPositionProvider'
import type { FC } from 'react'
import { useRef } from 'react'

import type { CellProps } from './types'

export const PairValueCell: FC<CellProps> = ({ row }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)
  return (
    <div ref={ref}>
      {inViewport && (
        <PoolPositionProvider watch={false} pair={row.pair}>
          <_PairValueCell row={row} />
        </PoolPositionProvider>
      )}
    </div>
  )
}

const _PairValueCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {formatUSD(row.valueUSD)}
    </Typography>
  )
}
