import type { FC, PropsWithoutRef, ReactNode } from 'react'
import type { ExtractProps } from '../types'
import { MenuItem as HeadlessMenuItem } from '@headlessui/react'
import classNames from 'classnames'

import { forwardRef } from 'react'

export type MenuItemProps = PropsWithoutRef<ExtractProps<typeof HeadlessMenuItem>> & {
  children?: ReactNode | Array<ReactNode>
  className?: string
  startIcon?: ReactNode
}

export const MenuItem: FC<MenuItemProps> = forwardRef<HTMLElement, MenuItemProps>(
  ({ className, startIcon, children, as, ...props }, ref) => {
    return (
      <HeadlessMenuItem
        {...props}
        as={as || 'div'}
        className={({ active }: { active: boolean, selected: boolean }) => classNames(
          active ? 'text-white bg-blue-500' : 'text-high-emphesis',
          'whitespace-nowrap flex gap-2 items-center font-medium text-sm cursor-pointer select-none relative py-2 pl-4 pr-9 my-1 mx-1 rounded-xl',
          className,
        )}
        ref={ref}
      >
        {startIcon && startIcon}
        {children}
      </HeadlessMenuItem>
    )
  },
)
