import { Listbox, Transition } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import { Fragment, forwardRef, useState } from 'react'

import type { ExtractProps } from '../types'

export type SelectOptionProps = ExtractProps<typeof Listbox.Option> & {
  href?: string
  children?: ReactNode
  showArrow?: boolean
}

const SelectOption: FC<SelectOptionProps> = forwardRef(({ className, children, showArrow = true, ...props }, ref) => {
  const [hover, setHover] = useState(false)

  return (
    <Listbox.Option
      ref={ref}
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={({ active }: { active: boolean }) =>
        classNames(
          active ? 'text-black dark:text-white bg-black/[0.06] dark:bg-white/[0.06]' : 'text-high-emphesis',
          'flex gap-2 px-2 items-center font-medium text-sm cursor-default select-none relative py-3 rounded-2xl whitespace-nowrap',
          className,
        )
      }
    >
      {children}
      <Transition
        as={Fragment}
        show={hover && showArrow}
        enter="ease-in-out duration-300"
        enterFrom="translate-x-[10px] opacity-0"
        enterTo="translate-x-[-10px] opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="translate-x-[-10px] opacity-100"
        leaveTo="translate-x-[10px] opacity-0"
        unmount={false}
      >
        <div className="absolute right-0 top-0 bottom-0 flex justify-center items-center">
          <div className="bg-slate-900 dark:bg-white text-blue-200 dark:text-blue rounded-full p-1 shadow-md shadow-black/30">
            <ArrowRightIcon width={10} height={10} />
          </div>
        </div>
      </Transition>
    </Listbox.Option>
  )
})

export default SelectOption
