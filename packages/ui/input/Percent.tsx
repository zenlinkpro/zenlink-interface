import React, { forwardRef } from 'react'

import { classNames } from '../index'
import { escapeRegExp, inputRegex } from './utils'
import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'

const defaultClassName = 'w-0 p-0 text-2xl bg-transparent'

export type PercentProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'as'> & {
  onUserInput?: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  variant?: 'default' | 'unstyled'
}

export const Input = forwardRef<HTMLInputElement, PercentProps>(
  ({ value, onUserInput, placeholder, className = defaultClassName, variant = 'default', error, ...rest }, ref) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (onUserInput)
          onUserInput(nextUserInput)
      }
    }

    return (
      <>
        <input
          autoComplete="off"
          autoCorrect="off"
          className={
            variant === 'default'
              ? classNames(DEFAULT_INPUT_CLASSNAME, error ? ERROR_INPUT_CLASSNAME : '', className)
              : className
          }
          inputMode="decimal"
          maxLength={3}
          onChange={(event) => {
            // replace commas with periods, because uniswap exclusively uses period as the decimal separator
            enforcer(event.target.value.replace(/,/g, '.').replace(/%/g, ''))
          }}
          pattern="^[0-9]*$"
          placeholder={placeholder || '100%'}
          ref={ref}
          title="Token Amount"
          type="text"
          value={value}
          {...rest}
        />
      </>
    )
  },
)

Input.displayName = 'PercentInput'

export default Input
