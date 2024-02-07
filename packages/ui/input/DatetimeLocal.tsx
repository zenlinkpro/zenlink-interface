import classNames from 'classnames'
import type { FC, Ref } from 'react'
import React, { forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'

export type DatetimeLocalProps = Omit<React.HTMLProps<HTMLInputElement>, 'as' | 'onChange' | 'value'> & {
  error: boolean
  value: string | undefined | null
  onChange: (x: string) => void
  ref?: Ref<HTMLInputElement> | undefined
  variant?: 'default' | 'unstyled'
}

export const DatetimeLocal: FC<DatetimeLocalProps> = forwardRef<HTMLInputElement, DatetimeLocalProps>(
  ({ value, onChange, className, error, variant = 'default', ...rest }, ref) => {
    return (
      <>
        <input
          className={
            variant === 'default'
              ? classNames(DEFAULT_INPUT_CLASSNAME, error ? ERROR_INPUT_CLASSNAME : '', className)
              : className
          }
          onChange={e => onChange(e.target.value)}
          ref={ref}
          type="datetime-local"
          value={value || ''}
          {...rest}
        />
      </>
    )
  },
)
