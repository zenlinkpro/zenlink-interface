import type { ComponentProps, JSX } from 'react'

import { ParachainId } from '@zenlink-interface/chain'
import { AmplitudeCircle } from './AmplitudeCircle'
import { ArbitrumCircle } from './ArbitrumCircle'
import { AstarCircle } from './AstarCircle'
import { BaseCircle } from './BaseCircle'
import { BifrostCircle } from './BifrostCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'
import { PendulumCircle } from './PendulumCircle'
import { ScrollCircle } from './ScrollCircle'
import { ScrollTestnetCircle } from './ScrollTestnetCircle'

export * from './AcalaCircle'
export * from './AmplitudeCircle'
export * from './ArbitrumCircle'
export * from './AstarCircle'
export * from './BifrostCircle'
export * from './KaruraCircle'
export * from './KintsugiCircle'
export * from './KusamaCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './PendulumCircle'
export * from './PolkadotCircle'
export * from './ShidenCircle'
export * from './StatemineCircle'

export const NETWORK_CIRCLE_ICON: Record<number, (props: ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverCircle,
  [ParachainId.MOONBEAM]: MoonbeamCircle,
  [ParachainId.ASTAR]: AstarCircle,
  [ParachainId.BIFROST_KUSAMA]: BifrostCircle,
  [ParachainId.BIFROST_POLKADOT]: BifrostCircle,
  [ParachainId.ARBITRUM_ONE]: ArbitrumCircle,
  [ParachainId.SCROLL_ALPHA]: ScrollTestnetCircle,
  [ParachainId.SCROLL]: ScrollCircle,
  [ParachainId.BASE]: BaseCircle,
  [ParachainId.AMPLITUDE]: AmplitudeCircle,
  [ParachainId.PENDULUM]: PendulumCircle,
}
