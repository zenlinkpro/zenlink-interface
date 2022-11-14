import { formatPercent } from '@zenlink-interface/format'
import type { Pair } from '@zenlink-interface/graph-client'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React from 'react'

import { AddSectionMyPositionUnstaked } from './AddSectionMyPositionUnstaked'

export const AddSectionMyPosition: FC<{ pair: Pair }> = ({ pair }) => {
  return (
    <div className="flex flex-col bg-white bg-opacity-[0.04] rounded-2xl">
      <div className="flex flex-col gap-4 p-5">
        <div className="grid items-center grid-cols-2 gap-2">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Total APR:
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-slate-300">
            {formatPercent(pair.apr)}
          </Typography>
        </div>
      </div>
      <div className="px-5">
        <hr className="h-px border-t border-slate-200/5" />
      </div>
      <div className="p-5 space-y-5">
        <AddSectionMyPositionUnstaked />
      </div>
    </div>
  )
}
