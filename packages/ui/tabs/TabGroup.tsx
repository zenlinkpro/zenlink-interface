import type { FC, PropsWithoutRef } from 'react'
import type { ExtractProps } from '../types'
import { TabGroup as HeadlessTabGroup } from '@headlessui/react'

import { forwardRef } from 'react'

export type TabGroupProps = PropsWithoutRef<ExtractProps<typeof HeadlessTabGroup>>

export const TabGroup: FC<TabGroupProps> = forwardRef<HTMLElement, TabGroupProps>(({ children, ...props }, ref) => {
  return (
    <HeadlessTabGroup {...props} ref={ref}>
      {children}
    </HeadlessTabGroup>
  )
})
