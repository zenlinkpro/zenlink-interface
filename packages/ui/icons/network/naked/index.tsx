import { ParachainId } from '@zenlink-interface/chain'
import type React from 'react'

import { AstarNaked } from './AstarNaked'
import { AmplitudeNaked } from './AmplitudeNaked'
import { BifrostNaked } from './BifrostNaked'
import { MoonbeamNaked } from './MoonbeamNaked'
import { MoonriverNaked } from './MoonriverNaked'

export * from './AcalalNaked'
export * from './AstarNaked'
export * from './AmplitudeNaked'
export * from './BifrostNaked'
export * from './KaruraNaked'
export * from './KintsugiNaked'
export * from './KusamaNaked'
export * from './MoonbeamNaked'
export * from './MoonriverNaked'
export * from './PolkadotNaked'
export * from './ShidenNaked'
export * from './StatemineNaked'

export const NETWORK_NAKED_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverNaked,
  [ParachainId.MOONBEAM]: MoonbeamNaked,
  [ParachainId.ASTAR]: AstarNaked,
  [ParachainId.AMPLITUDE]: AmplitudeNaked,
  [ParachainId.BIFROST_KUSAMA]: BifrostNaked,
  [ParachainId.BIFROST_POLKADOT]: BifrostNaked,
}
