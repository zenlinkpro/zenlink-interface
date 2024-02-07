import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import type { FC, FunctionComponent } from 'react'
import React, { Fragment, useEffect } from 'react'

import type { ExtractProps } from '../types'
import { useBreakpoint } from '../useBreakpoint'
import type { DialogActionProps } from './DialogActions'
import DialogActions from './DialogActions'
import type { DialogContentProps } from './DialogContent'
import DialogContent from './DialogContent'
import type { DialogDescriptionProps } from './DialogDescription'
import DialogDescription from './DialogDescription'
import type { DialogHeaderProps } from './DialogHeader'
import DialogHeader from './DialogHeader'

export type DialogRootProps = ExtractProps<typeof HeadlessDialog> & {
  afterLeave?: () => void
  children?: React.ReactNode
}

const DialogRoot: FC<DialogRootProps> = ({ open, onClose, children, afterLeave, ...rest }) => {
  const { unmount } = rest
  const { isMd } = useBreakpoint('md')

  // iOS body lock fix
  // This gets the current scroll position and sets it as negative top margin before setting position fixed on body
  // This is necessary because adding position fixed to body scrolls the page to the top
  useEffect(() => {
    if (!isMd) {
      if (open) {
        document.body.style.top = `-${window.scrollY}px`
        document.body.style.position = 'fixed'
        document.body.style.left = '0'
        document.body.style.right = '0'
      }
      else {
        const scrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        window.scrollTo(0, Number.parseInt(scrollY || '0') * -1)
      }
    }
  }, [isMd, open])

  return (
    <Transition afterLeave={afterLeave} as={Fragment} show={open} unmount={unmount}>
      <HeadlessDialog className="relative z-[1080]" onClose={onClose} {...rest}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={unmount}
        >
          <div className="fixed inset-0 bg-slate-200/80 dark:bg-slate-900/80" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              unmount={unmount}
            >
              <HeadlessDialog.Panel className="w-full h-full max-w-md px-1">
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

export const Dialog: FunctionComponent<DialogRootProps> & {
  Description: FunctionComponent<DialogDescriptionProps>
  Header: FunctionComponent<DialogHeaderProps>
  Actions: FunctionComponent<DialogActionProps>
  Content: FunctionComponent<DialogContentProps>
} = Object.assign(DialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  Description: DialogDescription,
  Actions: DialogActions,
})
