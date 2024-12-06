import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../index'

import React from 'react'
import { classNames } from '../index'

interface Props {
  className?: string
  description?: string
}

export type IconButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type IconButtonComponent = <C extends React.ElementType = 'button'>(
  props: IconButtonProps<C>
) => React.ReactNode | null

export const IconButton: IconButtonComponent = React.forwardRef(
  <Tag extends React.ElementType>(
    { as, children, className, description, ...rest }: IconButtonProps<Tag>,
    ref?: PolymorphicRef<Tag>,
  ) => {
    const Component = as || 'button'
    return (
      <Component
        ref={ref}
        {...rest}
        className={classNames(className, 'group relative focus:outline-none border:none')}
        type="button"
      >
        <span className="absolute rounded-full bg-black/[0.08] dark:bg-white/[0.08] hover:bg-black/[0.12] hover:dark:bg-white/[0.12]" />
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
