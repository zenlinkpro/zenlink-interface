import type { PropsWithoutRef, ReactNode } from 'react'
import type { ExtractProps } from '../types'
import { MenuButton as HeadlessMenuButton } from '@headlessui/react'

import React, { forwardRef } from 'react'
import { Button } from '..'

export type MenuButtonProps = PropsWithoutRef<ExtractProps<typeof HeadlessMenuButton>> & {
  children?: ReactNode
}

export const MenuButton: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MenuButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, MenuButtonProps>(({ className, children, ...props }, ref) => {
  return (
    <HeadlessMenuButton as={React.Fragment} ref={ref}>
      <Button {...props} className={className}>
        {children}
      </Button>
    </HeadlessMenuButton>
  )
})
