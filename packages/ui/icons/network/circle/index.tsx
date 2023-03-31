import { ParachainId } from '@zenlink-interface/chain'
import type * as React from 'react'

import { AstarCircle } from './AstarCircle'
import { BifrostCircle } from './BifrostCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'
import { AmplitudeCircle } from './AmplitudeCircle'

export * from './AstarCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './AmplitudeCircle'

export const NETWORK_CIRCLE_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverCircle,
  [ParachainId.MOONBEAM]: MoonbeamCircle,
  [ParachainId.ASTAR]: AstarCircle,
  [ParachainId.BIFROST_KUSAMA]: BifrostCircle,
  [ParachainId.AMPLITUDE]: AmplitudeCircle,
}
