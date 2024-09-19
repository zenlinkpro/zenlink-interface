import type { PropsWithoutRef } from 'react'
import type { ExtractProps } from '../types'
import { MenuItems as HeadlessMenuItems } from '@headlessui/react'

import React, { forwardRef } from 'react'
import { classNames } from '../index'

export type MenuItemsProps = PropsWithoutRef<ExtractProps<typeof HeadlessMenuItems>> & {
  className?: string
}

export const MenuItems: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MenuItemsProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, MenuItemsProps>(({ className, ...props }, ref) => {
  return (
    <HeadlessMenuItems
      {...props}
      className={classNames(
        className,
        'bg-gray-100 dark:bg-slate-700 absolute right-0 mt-2 min-w-[224px] w-[fit-content] rounded-xl ring-2 ring-black ring-opacity-5 shadow-md shadow-black/30 focus:outline-none',
      )}
      ref={ref}
    />
  )
})
