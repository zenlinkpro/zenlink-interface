import type { FC, LegacyRef, PropsWithoutRef, ReactNode } from 'react'
import type { ExtractProps } from '../types'
import { ListboxButton } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

import React, { forwardRef } from 'react'
import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from '../input'
import { Typography } from '../typography'

export type SelectButtonProps = PropsWithoutRef<ExtractProps<typeof ListboxButton>> & {
  open?: boolean
  children?: ReactNode
  standalone?: boolean
  error?: boolean
  ref?: LegacyRef<HTMLButtonElement>
}

const SelectButton: FC<SelectButtonProps> = forwardRef(
  ({ className, children, standalone, error = false, open, ...props }, ref) => {
    return React.createElement(
      standalone ? 'div' : ListboxButton,
      {
        ...props,
        ref,
        className: classNames(
          open ? 'ring-2 ring-offset-2 ring-blue bg-slate-200 dark:bg-slate-600' : '',
          'relative w-full pr-10',
          DEFAULT_INPUT_CLASSNAME,
          error ? ERROR_INPUT_CLASSNAME : '',
          className,
        ),
      },
      <>
        <Typography
          className={classNames(children ? '' : 'text-slate-600', 'block truncate')}
          variant="sm"
          weight={children ? 500 : 400}
        >
          {children}
        </Typography>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon
            className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-[transform] duration-150 ease-in-out')}
            height={24}
            width={24}
          />
        </span>
      </>,
    )
  },
)

export default SelectButton
