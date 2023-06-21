import { Menu as HeadlessMenu } from '@headlessui/react'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import { forwardRef } from 'react'

import type { ExtractProps } from '../types'

export type MenuItemProps = ExtractProps<typeof HeadlessMenu.Item> & {
  children?: ReactNode | Array<ReactNode>
  className?: string
  startIcon?: ReactNode
}

export const MenuItem: FC<MenuItemProps> = forwardRef<HTMLElement, MenuItemProps>(
  ({ className, startIcon, children, as, ...props }, ref) => {
    return (
      <HeadlessMenu.Item
        {...props}
        ref={ref}
        as={as || 'div'}
        className={({ active }: { active: boolean; selected: boolean }) =>
          classNames(
            active ? 'text-white bg-gradient-to-r from-[#29ccb9] to-[#0091ff] from-0% to-100%' : 'text-high-emphesis',
            'whitespace-nowrap flex gap-2 items-center font-medium text-sm cursor-pointer select-none relative py-2 pl-4 pr-9 my-1 mx-1 rounded-xl',
            className,
          )
        }
      >
        {startIcon && startIcon}
        {children}
      </HeadlessMenu.Item>
    )
  },
)
