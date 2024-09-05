import { Transition } from '@headlessui/react'
import { classNames } from '@zenlink-interface/ui'
import type { FC, ReactElement } from 'react'

import type { DefaultButtonProps } from './DefaultButton'

interface ComponentsWrapperProps {
  className?: string
  children:
    | ReactElement<DefaultButtonProps>
    | Array<ReactElement<DefaultButtonProps> | undefined>
    | Array<Array<ReactElement<DefaultButtonProps>> | ReactElement<DefaultButtonProps> | undefined>
    | undefined
}

export const ComponentsWrapper: FC<ComponentsWrapperProps> = ({ className, children }) => {
  return (
    <Transition
      appear
      as="div"
      className="transition-[max-height] overflow-hidden"
      enter="duration-[400ms] ease-in-out delay-300"
      enterFrom="transform max-h-0"
      enterTo="transform max-h-[80px]"
      leave="transition-[max-height] duration-250 ease-in-out"
      leaveFrom="transform max-h-[80px]"
      leaveTo="transform max-h-0"
      show={true}
    >
      <div className={classNames(className, 'relative flex gap-6')}>
        <div className="flex gap-6 z-10">{children}</div>
        <div className="absolute pointer-events-none top-0 bottom-3 flex items-center left-4 right-4">
          <div className="border border-dashed border-white border-opacity-[0.12] h-px w-full z-0" />
        </div>
      </div>
    </Transition>
  )
}
