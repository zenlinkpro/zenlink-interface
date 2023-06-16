import { ParachainId } from '@zenlink-interface/chain'
import type * as React from 'react'

import { AstarCircle } from './AstarCircle'
import { BifrostCircle } from './BifrostCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'
import { ArbitrumCircle } from './ArbitrumCircle'
import { MantaCircle } from './MantaCircle'
import { CalamariCircle } from './CalamariCircle'

export * from './AcalaCircle'
export * from './ArbitrumCircle'
export * from './AstarCircle'
export * from './BifrostCircle'
export * from './KaruraCircle'
export * from './KintsugiCircle'
export * from './KusamaCircle'
export * from './MantaCircle'
export * from './CalamariCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './PolkadotCircle'
export * from './ShidenCircle'
export * from './StatemineCircle'

export const NETWORK_CIRCLE_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  // [ParachainId.MOONRIVER]: MoonriverCircle,
  // [ParachainId.MOONBEAM]: MoonbeamCircle,
  // [ParachainId.ASTAR]: AstarCircle,
  // [ParachainId.BIFROST_KUSAMA]: BifrostCircle,
  // [ParachainId.BIFROST_POLKADOT]: BifrostCircle,
  [ParachainId.CALAMARI_KUSAMA]: CalamariCircle,
  // [ParachainId.MANTA_POLKADOT]: MantaCircle,
  // [ParachainId.ARBITRUM_ONE]: ArbitrumCircle,
}
