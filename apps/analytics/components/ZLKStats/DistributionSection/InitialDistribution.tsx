import type { ParachainId } from '@zenlink-interface/chain'
import { usePoolFilters } from 'components'
import stringify from 'fast-json-stable-stringify'
import type { FC } from 'react'
import { useMemo } from 'react'
import useSWR from 'swr'
import InitialSvg, { RateDesc } from './InitialSvg'
export const InitialDistribution: FC = () => {
  return (
    <section className="">
      <div className="h-80 flex justify-center items-center">
        <div className="w-80">
          <InitialSvg />
        </div>
      </div>
      <div className="h-40 grid grid-cols-2">
        <div className="text-white text-xs self-center justify-self-center">
          <RateDesc className="text-sm font-semibold" color="#01A3EEFF" desc={''} title={'Kusama: 40M (40%)'}/>
          <RateDesc className="my-5 ml-3 text-xs" color="#0FCED6FF" desc={''} title={'Moonriver: 30M (30%)'}/>
          <RateDesc className="ml-3 text-xs" color="#6BDF9EFF" desc={''} title={'Bifrost: 10M (10%)'}/>
        </div>
        <div className="text-white text-xs self-center justify-self-center">
          <RateDesc className="text-sm font-semibold" color="#FF1995FF" desc={''} title={'Polkadot: 60M (60%)'}/>
          <RateDesc className="my-5 ml-3 text-xs" color="#F32FE1FF" desc={''} title={'Moonbeam: 50M (50%)'}/>
          <RateDesc className="ml-3 text-xs" color="#975CF5FF" desc={''} title={'Astar: 10M (10%)'}/>
        </div>
      </div>
    </section>
  )
}
