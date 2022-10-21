import { ParachainId } from '@zenlink-interface/chain'
import type React from 'react'

import { MoonbeamNaked } from './MoonbeamNaked'
import { MoonriverNaked } from './MoonriverNaked'

export * from './MoonbeamNaked'
export * from './MoonriverNaked'

export const NETWORK_NAKED_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ParachainId.MOONRIVER]: MoonriverNaked,
  [ParachainId.MOONBEAM]: MoonbeamNaked,
}
