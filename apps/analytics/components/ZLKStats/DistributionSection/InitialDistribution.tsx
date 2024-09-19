import type { FC } from 'react'
import { Trans } from '@lingui/macro'
import { Typography } from '@zenlink-interface/ui'
import InitialIcon, { RateDesc } from './InitialIcon'

export const InitialDistribution: FC = () => {
  return (
    <section>
      <Typography weight={600}><Trans>Initial Distribution</Trans></Typography>
      <div className="h-72">
        <div className="flex justify-center items-center mt-8">
          <div className="w-80">
            <InitialIcon />
          </div>
        </div>
      </div>
      <div className="h-40 grid grid-cols-1 md:grid-cols-2">
        <div className="self-center justify-self-center">
          <RateDesc className="text-base" color="#01A3EEFF" desc="40M (40%)" title="Kusama" />
          <div className="flex flex-col mt-1 pl-3 text-sm">
            <RateDesc color="#0FCED6FF" desc="30M (30%)" title="Moonriver" />
            <RateDesc color="#6BDF9EFF" desc="10M (10%)" title="Bifrost" />
          </div>
        </div>
        <div className="self-center justify-self-center">
          <RateDesc className="text-base" color="#FF1995FF" desc="60M (60%)" title="Polkadot" />
          <div className="flex flex-col mt-1 pl-3 text-sm">
            <RateDesc color="#F32FE1FF" desc="50M (50%)" title="Moonbeam" />
            <RateDesc color="#975CF5FF" desc="10M (10%)" title="Astar" />
          </div>
        </div>
      </div>
    </section>
  )
}
