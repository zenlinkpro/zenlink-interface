import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import type { FC, FunctionComponent, ReactNode } from 'react'
import { Fragment, forwardRef } from 'react'

import { Button } from '../button'
import type { ExtractProps } from '../types'
import type { TabGroupProps } from './TabGroup'
import { TabGroup } from './TabGroup'
import type { TabListProps } from './TabList'
import { TabList } from './TabList'

export type TabButton = Omit<ExtractProps<typeof HeadlessTab>, 'children'> & { children: ReactNode }

const _Tab: FC<TabButton> = forwardRef<HTMLElement, TabButton>(({ children, className, ...props }, ref) => {
  return (
    <HeadlessTab as={Fragment} ref={ref}>
      {({ selected }) => (
        <Button
          size="sm"
          className={classNames(className, 'hover:ring-0 focus:ring-0 outline-none')}
          color="gray"
          variant={selected ? 'filled' : 'empty'}
          {...props}
        >
          {children}
        </Button>
      )}
    </HeadlessTab>
  )
})

export const Tab: FunctionComponent<TabButton> & {
  Group: FC<TabGroupProps>
  List: FC<TabListProps>
  Panels: FC<ExtractProps<typeof HeadlessTab.Panels>>
  Panel: FC<ExtractProps<typeof HeadlessTab.Panel>>
} = Object.assign(_Tab, {
  Group: TabGroup,
  List: TabList,
  Panels: HeadlessTab.Panels,
  Panel: HeadlessTab.Panel,
})
