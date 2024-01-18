import { Transition } from '@headlessui/react'
import { useIsSmScreen } from '@zenlink-interface/hooks'
import classNames from 'classnames'
import type { FC, ReactElement } from 'react'
import { Fragment } from 'react'
import ReactDOM from 'react-dom'

import { Dialog } from '../../dialog'
import { useSlideInContext } from './SlideIn'
import { useEscapeClose } from './useEscapeClose'

export interface FromTopProps {
  show: boolean
  onClose(): void
  afterEnter?(): void
  beforeEnter?(): void
  beforeLeave?(): void
  afterLeave?(): void
  children: ReactElement
  className?: string
}

export const FromTop: FC<FromTopProps> = ({
  show,
  beforeLeave,
  beforeEnter,
  afterEnter,
  afterLeave,
  onClose,
  children,
  className,
}) => {
  const isSmallScreen = useIsSmScreen()
  useEscapeClose(onClose)

  const portal = useSlideInContext()
  if (!portal)
    return <></>

  if (isSmallScreen) {
    return (
      <Dialog initialFocus={undefined} onClose={onClose} open={show} unmount={false}>
        <div className="!rounded-t-2xl overflow-hidden">{children}</div>
      </Dialog>
    )
  }

  return ReactDOM.createPortal(
    <Transition.Root appear as={Fragment} show={show} unmount={false}>
      <div className={classNames(className, 'absolute left-0 right-0 top-0 h-full translate-y-[-100%] z-50')}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={false}
        >
          <div
            aria-hidden="true"
            className="translate-y-full absolute inset-0 bg-black/70 transition-opacity"
            onClick={onClose}
          />
        </Transition.Child>
        <Transition.Child
          afterEnter={afterEnter}
          afterLeave={afterLeave}
          as={Fragment}
          beforeEnter={beforeEnter}
          beforeLeave={beforeLeave}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-y-0"
          enterTo="translate-y-full"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-y-full"
          leaveTo="translate-y-0"
          unmount={false}
        >
          {children}
        </Transition.Child>
      </div>
    </Transition.Root>,
    portal,
  )
}
