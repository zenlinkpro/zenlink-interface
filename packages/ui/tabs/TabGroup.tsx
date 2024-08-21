import { Tab as HeadlessTab } from '@headlessui/react'
import type { FC, PropsWithoutRef } from 'react'
import { forwardRef } from 'react'

import type { ExtractProps } from '../types'

export type TabGroupProps = PropsWithoutRef<ExtractProps<typeof HeadlessTab.Group>>

export const TabGroup: FC<TabGroupProps> = forwardRef<HTMLElement, TabGroupProps>(({ children, ...props }, ref) => {
  return (
    <HeadlessTab.Group {...props} ref={ref}>
      {children}
    </HeadlessTab.Group>
  )
})
