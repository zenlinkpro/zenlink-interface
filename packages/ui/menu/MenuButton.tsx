import { MenuButton as HeadlessMenuButton } from '@headlessui/react'
import type { PropsWithoutRef, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '..'
import type { ExtractProps } from '../types'

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
