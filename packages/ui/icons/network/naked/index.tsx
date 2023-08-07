import { ParachainId } from '@zenlink-interface/chain'
import type React from 'react'

import { BaseNaked } from './BaseNaked'
import { AstarNaked } from './AstarNaked'
import { BifrostNaked } from './BifrostNaked'
import { MoonbeamNaked } from './MoonbeamNaked'
import { MoonriverNaked } from './MoonriverNaked'
import { ArbitrumNaked } from './ArbitrumNaked'
import { ScrollTestnetNaked } from './ScrollTestnetNaked'

export * from './AcalalNaked'
export * from './ArbitrumNaked'
export * from './AstarNaked'
export * from './BifrostNaked'
export * from './KaruraNaked'
export * from './KintsugiNaked'
export * from './KusamaNaked'
export * from './MoonbeamNaked'
export * from './MoonriverNaked'
export * from './PolkadotNaked'
export * from './ScrollTestnetNaked'
export * from './ShidenNaked'
export * from './StatemineNaked'

export const NETWORK_NAKED_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverNaked,
  [ParachainId.MOONBEAM]: MoonbeamNaked,
  [ParachainId.ASTAR]: AstarNaked,
  [ParachainId.BIFROST_KUSAMA]: BifrostNaked,
  [ParachainId.BIFROST_POLKADOT]: BifrostNaked,
  [ParachainId.ARBITRUM_ONE]: ArbitrumNaked,
  [ParachainId.SCROLL_ALPHA]: ScrollTestnetNaked,
  [ParachainId.BASE]: BaseNaked,
}
