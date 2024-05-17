import type { FC } from 'react'
import { GaugesTable } from './Tables'

export const GaugesSection: FC = () => {
  return (
    <section className="flex flex-col">
      <GaugesTable />
    </section>
  )
}
