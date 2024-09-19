import type { FC } from 'react'
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

import { LogoLoader } from './LogoLoader'

export const LoadingOverlay: FC<{ show?: boolean }> = ({ show }) => {
  return (
    <Transition
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={show}
    >
      <div className="fixed z-[9999] flex items-center justify-center inset-0 transition-opacity bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
        <LogoLoader height={36} width={36} />
      </div>
    </Transition>
  )
}
