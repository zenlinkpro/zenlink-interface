import type { FC, FunctionComponent, PropsWithoutRef, ReactNode } from 'react'
import type { ExtractProps } from '../types'
import type { TabGroupProps } from './TabGroup'
import type { TabListProps } from './TabList'

import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import { forwardRef, Fragment } from 'react'
import { Button } from '../button'
import { TabGroup } from './TabGroup'
import { TabList } from './TabList'

export type TabButton = PropsWithoutRef<Omit<ExtractProps<typeof HeadlessTab>, 'children'>> & {
  children: ReactNode
}

const _Tab: FC<TabButton> = forwardRef<HTMLElement, TabButton>(({ children, className, ...props }, ref) => {
  return (
    <HeadlessTab as={Fragment} ref={ref}>
      {({ selected }) => (
        <Button
          className={classNames(className, 'hover:ring-0 focus:ring-0 outline-none')}
          color="gray"
          size="sm"
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
