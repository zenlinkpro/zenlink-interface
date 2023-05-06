import type { Pair } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { UnStakeSectionWidgetStandard } from './UnStakeSectionWidgetStandard'

interface UnStakeSectionStandardProps {
  pair: Pair
}

export const UnStakeSectionStandard: FC<UnStakeSectionStandardProps> = ({ pair }) => {
  return (
    <div>
      <UnStakeSectionWidgetStandard
        isFarm={true}
        chainId={pair.chainId}
        pair={pair}
      />
    </div>
  )
}
