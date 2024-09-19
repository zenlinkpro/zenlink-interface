import type { PoolFarm } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import type { CellProps } from './types'
import { formatPercent } from '@zenlink-interface/format'

import { Typography } from '@zenlink-interface/ui'
import { useMemo } from 'react'

export const PoolAPRCell: FC<CellProps> = ({ row }) => {
  const bestApr = useMemo(() => {
    const farms = row.farm ?? []
    const bestFarmApr = farms.reduce((best: number, cur: PoolFarm) => {
      const stakeApr = Number(cur?.stakeApr)
      if (Number.isNaN(stakeApr))
        return best
      return best > stakeApr ? best : stakeApr
    }, 0)
    return (bestFarmApr) + row.feeApr
  }, [row.farm, row.feeApr])

  return (
    <Typography className="flex items-center justify-end gap-1 text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {formatPercent(bestApr)}
    </Typography>
  )
}
