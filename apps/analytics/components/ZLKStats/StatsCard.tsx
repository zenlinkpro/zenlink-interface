import { Typography } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'
import React from 'react'

interface StatsCardProps {
  text: string | ReactNode
  stats: string
  loading?: boolean
}

export const StatsCard: FC<StatsCardProps> = ({ text, stats, loading }) => {
  return (
    <div className="w-full py-3 px-9 gap-2 flex flex-col rounded-lg shadow-sm border border-slate-500/20 bg-slate-300/20 dark:bg-slate-800/20">
      <Typography className="text-slate-700 dark:text-slate-300">{text}</Typography>
      {loading
        ? <div className="h-8 bg-slate-300 dark:bg-slate-700 animate-pulse rounded-lg" />
        : <Typography variant="h3" weight={700}>{stats}</Typography>}
    </div>
  )
}
