import type { FC, PropsWithoutRef } from 'react'
import type { ExtractProps } from '../types'
import { TabList as HeadlessTabList } from '@headlessui/react'
import classNames from 'classnames'

import { forwardRef } from 'react'

export type TabListProps = PropsWithoutRef<ExtractProps<typeof HeadlessTabList>>

export const TabList: FC<TabListProps> = forwardRef<HTMLElement, TabListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <HeadlessTabList
        {...props}
        className={classNames(
          'bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden grid grid-flow-col',
          className,
        )}
        ref={ref}
      >
        {children}
      </HeadlessTabList>
    )
  },
)
