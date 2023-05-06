import type { Pair } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { StakeSectionWidgetStandard } from './StakeSectionWidgetStandard'

interface StakeSectionLegacyProps {
  pair: Pair
}

export const StakeSectionStandard: FC<StakeSectionLegacyProps> = ({ pair }) => {
  return (
    <div>
      <StakeSectionWidgetStandard
        isFarm={true}
        chainId={pair.chainId}
        pair={pair}
      />
    </div>
  )
}
