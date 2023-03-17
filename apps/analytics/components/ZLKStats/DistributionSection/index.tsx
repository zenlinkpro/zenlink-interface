import type { FC } from 'react'
import { CirculatingDistribution } from './CirculatingDistribution'
import { InitialDistribution } from './InitialDistribution'

export const DistributionSection: FC = () => {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="p-6 bg-slate-800/20 rounded-xl">
        <InitialDistribution />
      </div>
      <div className="p-6 bg-slate-800/20 rounded-xl">
        <CirculatingDistribution />
      </div>
    </section>
  )
}
