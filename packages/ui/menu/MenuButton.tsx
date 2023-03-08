import { Menu as HeadlessMenu } from '@headlessui/react'
import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '..'
import type { ExtractProps } from '../types'

export type MenuButtonProps = ExtractProps<typeof HeadlessMenu.Button> & {
  children?: ReactNode
}

export const MenuButton: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MenuButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, MenuButtonProps>(({ className, children, ...props }, ref) => {
  return (
    <HeadlessMenu.Button as={React.Fragment} ref={ref}>
      <Button {...props} className={className}>
        {children}
      </Button>
    </HeadlessMenu.Button>
  )
})
