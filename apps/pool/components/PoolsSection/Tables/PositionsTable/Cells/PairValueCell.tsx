import { formatUSD } from '@zenlink-interface/format'
import { useInViewport } from '@zenlink-interface/hooks'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useRef } from 'react'

import { PoolPositionProvider } from 'components'
import type { CellProps } from './types'

export const PairValueCell: FC<CellProps> = ({ row }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)
  return (
    <div ref={ref}>
      {inViewport && (
        <PoolPositionProvider pool={row.pool} watch={false}>
          <_PairValueCell row={row} />
        </PoolPositionProvider>
      )}
    </div>
  )
}

const _PairValueCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {formatUSD(row.valueUSD)}
    </Typography>
  )
}
