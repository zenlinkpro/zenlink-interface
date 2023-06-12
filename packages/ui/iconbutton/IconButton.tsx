import type { ReactNode } from 'react'
import React from 'react'

import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../index'
import { classNames } from '../index'

interface Props {
  children: ReactNode
  className?: string
  description?: string
}

export type IconButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type IconButtonComponent = <C extends React.ElementType = 'button'>(
  props: IconButtonProps<C>
) => ReactNode | null

export const IconButton: IconButtonComponent = React.forwardRef(
  <Tag extends React.ElementType = 'button'>(
    { as, children, className, description, ...rest }: IconButtonProps<Tag>,
    ref?: PolymorphicRef<Tag>,
  ) => {
    const Component = as || 'button'
    return (
      <Component
        ref={ref}
        {...rest}
        type="button"
        className={classNames(className, 'group relative focus:outline-none border:none')}
      >
        <span
        className="absolute rounded-full bg-black/[0.08] dark:bg-white/[0.08] hover:bg-black/[0.12] hover:dark:bg-white/[0.12]" />
        {children}
        {description && (
          <span className="whitespace-nowrap text-xs group-hover:flex hidden absolute mt-2 w-full justify-center">
            {description}
          </span>
        )}
      </Component>
    )
  },
)
