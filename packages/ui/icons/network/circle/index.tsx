import { ParachainId } from '@zenlink-interface/chain'
import type * as React from 'react'

import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'

export * from './MoonbeamCircle'
export * from './MoonriverCircle'

export const NETWORK_CIRCLE_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverCircle,
  [ParachainId.MOONBEAM]: MoonbeamCircle,
}
