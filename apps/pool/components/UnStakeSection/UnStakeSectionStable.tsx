import type { Pair, StableSwap } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { UnStakeSectionStandard } from './UnStakeSectionStandard'

interface UnStakeSectionStableProps {
  pool: StableSwap
}

export const UnStakeSectionStable: FC<UnStakeSectionStableProps> = ({ pool }) => {
  return <UnStakeSectionStandard pair={pool as unknown as Pair} />
}
