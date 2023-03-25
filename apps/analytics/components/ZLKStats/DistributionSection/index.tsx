import type { FC } from 'react'
import { CirculatingDistribution } from './CirculatingDistribution'
import { InitialDistribution } from './InitialDistribution'

export const DistributionSection: FC = () => {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="p-6 bg-slate-300/20 dark:bg-slate-800/20 rounded-xl shadow-sm border border-slate-500/20">
        <InitialDistribution />
      </div>
      <div className="p-6 bg-slate-300/20 dark:bg-slate-800/20 rounded-xl shadow-sm border border-slate-500/20">
        <CirculatingDistribution />
      </div>
    </section>
  )
}
