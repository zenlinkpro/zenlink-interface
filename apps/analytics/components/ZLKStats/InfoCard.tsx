import React from 'react'

interface InfoCardProps {
  text: string
  number: string
  loading?: boolean
}

export function InfoCard({ text, number, loading }: InfoCardProps) {
  return (
    <div className="w-full py-3 px-9 gap-2 flex flex-col rounded-lg shadow-md bg-slate-800/20">
      <div className="whitespace-nowrap">{text}</div>
      {loading
        ? <div className="h-8 bg-slate-700 animate-pulse rounded-lg" />
        : <div className="text-2xl font-bold">{number}</div>
      }
    </div>
  )
}
