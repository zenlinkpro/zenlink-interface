import { ParachainId } from '@zenlink-interface/chain'
import type * as React from 'react'

import { AstarCircle } from './AstarCircle'
import { AmplitudeCircle } from './AmplitudeCircle'
import { BifrostCircle } from './BifrostCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'

export * from './AcalaCircle'
export * from './AstarCircle'
export * from './AmplitudeCircle'
export * from './BifrostCircle'
export * from './KaruraCircle'
export * from './KintsugiCircle'
export * from './KusamaCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './PolkadotCircle'
export * from './ShidenCircle'
export * from './StatemineCircle'

export const NETWORK_CIRCLE_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverCircle,
  [ParachainId.MOONBEAM]: MoonbeamCircle,
  [ParachainId.ASTAR]: AstarCircle,
  [ParachainId.AMPLITUDE]: AmplitudeCircle,
  [ParachainId.BIFROST_KUSAMA]: BifrostCircle,
  [ParachainId.BIFROST_POLKADOT]: BifrostCircle,
}
