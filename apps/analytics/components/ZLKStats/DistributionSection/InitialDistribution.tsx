import type { FC } from 'react'
import InitialSvg, { RateDesc } from './InitialSvg'

export const InitialDistribution: FC = () => {
  return (
    <section>
      <div className="font-semibold text-base">Initial Distribution</div>
      <div className="h-72">
        <div className="flex justify-center items-center mt-8">
          <div className="w-80">
            <InitialSvg />
          </div>
        </div>
      </div>
      <div className="h-40 grid grid-cols-1 md:grid-cols-2">
        <div className="self-center justify-self-center">
          <RateDesc className="text-base" color="#01A3EEFF" title="Kusama" desc="40M (40%)" />
          <div className="flex flex-col mt-1 pl-3 text-sm">
            <RateDesc color="#0FCED6FF" title="Moonriver" desc="30M (30%)" />
            <RateDesc color="#6BDF9EFF" title="Bifrost" desc="10M (10%)" />
          </div>
        </div>
        <div className="self-center justify-self-center">
          <RateDesc className="text-base" color="#FF1995FF" title="Polkadot" desc="60M (60%)" />
          <div className="flex flex-col mt-1 pl-3 text-sm">
            <RateDesc color="#F32FE1FF" title="Moonbeam" desc="50M (50%)" />
            <RateDesc color="#975CF5FF" title="Astar" desc="10M (10%)" />
          </div>
        </div>
      </div>
    </section>
  )
}
