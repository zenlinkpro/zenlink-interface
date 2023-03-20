import { Typography } from '@zenlink-interface/ui'
import React from 'react'

interface StatsCardProps {
  text: string
  stats: string
  loading?: boolean
}

export function StatsCard({ text, stats, loading }: StatsCardProps) {
  return (
    <div className="w-full py-3 px-9 gap-2 flex flex-col rounded-lg shadow-md bg-slate-800/20">
      <Typography className="text-slate-300">{text}</Typography>
      {loading
        ? <div className="h-8 bg-slate-700 animate-pulse rounded-lg" />
        : <Typography variant="h3" weight={700}>{stats}</Typography>
      }
    </div>
  )
}
