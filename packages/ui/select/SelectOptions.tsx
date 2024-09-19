import type { FC, LegacyRef, PropsWithoutRef } from 'react'
import type { ExtractProps } from '../types'
import { ListboxOptions } from '@headlessui/react'
import classNames from 'classnames'

import { forwardRef } from 'react'

export type SelectOptionsProps = PropsWithoutRef<ExtractProps<typeof ListboxOptions>> & {
  ref?: LegacyRef<HTMLElement>
}

const SelectOptions: FC<SelectOptionsProps> = forwardRef(({ className, ...props }, ref) => {
  return (
    <ListboxOptions
      className={classNames(
        className,
        'absolute z-[100] mt-3 bg-white dark:bg-slate-700 overflow-auto shadow-dropdown p-2 scroll max-h-40 md:max-h-60 rounded-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
      )}
      {...props}
      ref={ref}
    />
  )
})

export default SelectOptions
