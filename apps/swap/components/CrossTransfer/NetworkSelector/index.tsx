import type { ReactNode } from 'react'

import { NetworkSelectorDialog } from './NetworkSelectorDialog'
import { NetworkSelectorMenu } from './NetworkSelectorMenu'

type ChainName = string

export type NetworkSelectorOnSelectCallback<T extends string = ChainName> = (chainId: T, close: () => void) => void

export interface NetworkSelectorProps<T extends string = ChainName> {
  networks: readonly T[]
  selected: T
  onSelect: NetworkSelectorOnSelectCallback<T>
  variant: 'menu' | 'dialog'
  align?: 'left' | 'right'
  children: ((props: { open: boolean; close(): void }) => ReactNode) | ReactNode
}

export function NetworkSelector<T extends string>({
  networks,
  variant,
  selected,
  onSelect,
  children,
  align,
}: NetworkSelectorProps<T>) {
  if (variant === 'dialog') {
    return (
      <NetworkSelectorDialog selected={selected} networks={networks} onSelect={onSelect}>
        {children}
      </NetworkSelectorDialog>
    )
  }

  return (
    <NetworkSelectorMenu networks={networks} selected={selected} onSelect={onSelect} align={align}>
      {children}
    </NetworkSelectorMenu>
  )
}
