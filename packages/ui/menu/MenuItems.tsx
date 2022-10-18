import { Menu as HeadlessMenu } from '@headlessui/react'
import React, { forwardRef } from 'react'

import { classNames } from '../index'
import type { ExtractProps } from '../types'

export type MenuItemsProps = ExtractProps<typeof HeadlessMenu.Items> & {
  className?: string
}

export const MenuItems: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MenuItemsProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, MenuItemsProps>(({ className, ...props }, ref) => {
  return (
    <HeadlessMenu.Items
      {...props}
      ref={ref}
      className={classNames(
        className,
        'bg-slate-700 absolute right-0 mt-2 min-w-[224px] w-[fit-content] rounded-xl ring-2 ring-black ring-opacity-5 shadow-md shadow-black/30 focus:outline-none',
      )}
    />
  )
})
