import { formatPercent } from '@zenlink-interface/format'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo } from 'react'

import type { CellProps } from './types'

export const PoolAPRCell: FC<CellProps> = ({ row }) => {
  const bestApr = useMemo(() => {
    const farms = row.farm ?? []
    const bestFarmApr = farms.reduce((best: number, cur: any) => {
      const stakeApr = Number(cur?.stakeApr)
      if (Number.isNaN(stakeApr))
        return best
      return best > stakeApr ? best : stakeApr
    }, 0)
    return (bestFarmApr) + row.feeApr
  }, [row.farm, row.feeApr])
  return (
    <Typography variant="sm" weight={600} className="flex items-center justify-end gap-1  text-slate-900 dark:text-slate-50">
      {formatPercent(bestApr)}
    </Typography>
  )
}
