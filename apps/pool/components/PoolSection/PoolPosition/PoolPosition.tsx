import { formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { Typography, useBreakpoint } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { usePoolPosition } from '../../PoolPositionProvider'
import { PoolPositionDesktop } from './PoolPositionDesktop'

interface PoolPositionProps {
  pool: Pool
}

export const PoolPosition: FC<PoolPositionProps> = ({ pool }) => {
  const { values } = usePoolPosition()
  const { isLg } = useBreakpoint('lg')

  if (!isLg)
    return <></>

  return (
    <div className="flex flex-col shadow-md bg-slate-800 rounded-2xl shadow-black/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/5">
        <Typography weight={600} className="text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-right text-slate-50">
            {formatUSD(values.reduce((total, current) => total + current, 0))}
          </Typography>
        </div>
      </div>
      <PoolPositionDesktop pool={pool} />
    </div>
  )
}
