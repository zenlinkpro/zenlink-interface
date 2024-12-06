import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../types'
import classNames from 'classnames'

import React, { forwardRef } from 'react'

export type MaxWidth = 'full' | '7xl' | '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'

const TailwindMapper: Record<MaxWidth, string> = {
  'full': 'max-w-full',
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  'xl': 'max-w-xl',
  'lg': 'max-w-lg',
  'md': 'max-w-md',
  'sm': 'max-w-sm',
  'xs': 'max-w-xs',
}

interface Props {
  maxWidth?: MaxWidth | number
  className?: string
  id?: string
}

type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
type ContainerComponent = <C extends React.ElementType = 'div'>(props: ContainerProps<C>) => React.ReactNode | null

export const Container: ContainerComponent = forwardRef(
  <Tag extends React.ElementType>(
    { as, children, maxWidth = '2xl', className = '', id, ...rest }: ContainerProps<Tag>,
    ref?: PolymorphicRef<Tag>,
  ) => {
    const Component = as || 'div'
    return (
      <Component
        className={classNames(className, typeof maxWidth === 'number' ? '' : TailwindMapper[maxWidth], 'w-full')}
        id={id}
        ref={ref}
        {...((typeof maxWidth === 'number' || rest.style) && { style: { ...rest.style, maxWidth } })}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

export default Container
