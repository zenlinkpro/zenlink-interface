import type { FC, LegacyRef, PropsWithoutRef, ReactNode } from 'react'
import type { ExtractProps } from '../types'
import { ListboxOption, Transition } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

import { forwardRef, useState } from 'react'

export type SelectOptionProps = PropsWithoutRef<ExtractProps<typeof ListboxOption>> & {
  href?: string
  children?: ReactNode
  showArrow?: boolean
  ref?: LegacyRef<HTMLElement>
}

const SelectOption: FC<SelectOptionProps> = forwardRef(({ className, children, showArrow = true, ...props }, ref) => {
  const [hover, setHover] = useState(false)

  return (
    <ListboxOption
      {...props}
      className={({ active }: { active: boolean }) => classNames(
        active ? 'text-black dark:text-white bg-black/[0.06] dark:bg-white/[0.06]' : 'text-high-emphesis',
        'flex gap-2 px-2 items-center font-medium text-sm cursor-default select-none relative py-3 rounded-2xl whitespace-nowrap',
        className,
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      ref={ref}
    >
      {children}
      <Transition show={hover && showArrow}>
        <div className="ease-in-out duration-300 translate-x-[-10px] data-[closed]:translate-x-[10px] data-[closed]:opacity-0 absolute right-0 top-0 bottom-0 flex justify-center items-center">
          <div className="bg-slate-700 dark:bg-white text-blue-100 dark:text-blue rounded-full p-1 shadow-md shadow-black/30">
            <ArrowRightIcon height={10} width={10} />
          </div>
        </div>
      </Transition>
    </ListboxOption>
  )
})

export default SelectOption
