import { Listbox } from '@headlessui/react'
import classNames from 'classnames'
import type { FC } from 'react'
import { forwardRef } from 'react'

import type { ExtractProps } from '../types'

export type SelectOptionsProps = ExtractProps<typeof Listbox.Options>

const SelectOptions: FC<SelectOptionsProps> = forwardRef(({ className, ...props }, ref) => {
  return (
    <Listbox.Options
      ref={ref}
      className={classNames(
        className,
        'absolute z-[100] mt-3 bg-white dark:bg-slate-700 overflow-auto shadow-dropdown p-2 scroll max-h-40 md:max-h-60 rounded-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
      )}
      {...props}
    />
  )
})

export default SelectOptions
