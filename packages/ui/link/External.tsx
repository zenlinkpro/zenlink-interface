import type { FC, HTMLProps, JSX, Ref } from 'react'
import classNames from 'classnames'
import React, { forwardRef, useCallback } from 'react'

const COLOR = {
  primary: 'hover:text-black hover:dark:text-white hover:underline focus:text-white active:text-white',
  blue: 'text-blue',
}

export type Color = 'primary' | 'blue'

export interface ExternalLinkProps extends Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> {
  href: string
  color?: Color
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

export const External: FC<ExternalLinkProps> = forwardRef(({
  target = '_blank',
  href,
  children,
  rel = 'noopener noreferrer',
  className = '',
  color = 'primary',
  startIcon = undefined,
  endIcon = undefined,
  ...rest
}, ref: Ref<HTMLAnchorElement>) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey)
        event.stopPropagation()
      else
        event.preventDefault()
    },
    [target],
  )
  return (
    <a
      className={classNames(
        'whitespace-nowrap',
        COLOR[color],
        (startIcon || endIcon) && 'space-x-1 flex items-center justify-center',
        className,
      )}
      href={href}
      onClick={handleClick}
      ref={ref}
      rel={rel}
      target={target}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </a>
  )
})
