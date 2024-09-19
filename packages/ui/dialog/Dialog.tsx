import type { FC, FunctionComponent, ReactNode } from 'react'
import type { ExtractProps } from '../types'
import type { DialogActionProps } from './DialogActions'

import type { DialogContentProps } from './DialogContent'
import type { DialogDescriptionProps } from './DialogDescription'
import type { DialogHeaderProps } from './DialogHeader'
import { Dialog as HeadlessDialog, DialogPanel as HeadlessDialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useEffect } from 'react'
import { useBreakpoint } from '../useBreakpoint'
import DialogActions from './DialogActions'
import DialogContent from './DialogContent'
import DialogDescription from './DialogDescription'
import DialogHeader from './DialogHeader'

export type DialogRootProps = ExtractProps<typeof HeadlessDialog> & {
  afterLeave?: () => void
  children?: ReactNode
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
    <Transition afterLeave={afterLeave} show={open} unmount={unmount}>
      <HeadlessDialog className="relative z-[1080] transition ease-in-out duration-300" onClose={onClose} {...rest}>
        <TransitionChild unmount={unmount}>
          <div className="transition ease-in-out duration-300 fixed inset-0 bg-slate-200/80 dark:bg-slate-900/80 data-[closed]:opacity-0" />
        </TransitionChild>
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full text-center">
            <TransitionChild unmount={unmount}>
              <HeadlessDialogPanel className="transition ease-in-out duration-300 w-full max-w-md px-1 data-[closed]:opacity-0 data-[closed]:translate-y-4 sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-95">
                {children}
              </HeadlessDialogPanel>
            </TransitionChild>
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
