import { TabGroup as HeadlessTabGroup } from '@headlessui/react'
import type { FC, PropsWithoutRef } from 'react'
import { forwardRef } from 'react'

import type { ExtractProps } from '../types'

export type TabGroupProps = PropsWithoutRef<ExtractProps<typeof HeadlessTabGroup>>

export const TabGroup: FC<TabGroupProps> = forwardRef<HTMLElement, TabGroupProps>(({ children, ...props }, ref) => {
  return (
    <HeadlessTabGroup {...props} ref={ref}>
      {children}
    </HeadlessTabGroup>
  )
})
