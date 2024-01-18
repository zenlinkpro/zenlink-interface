import { Transition } from '@headlessui/react'
import { useIsMounted } from '@zenlink-interface/hooks'
import type { ElementType, FC, ReactNode } from 'react'

interface AppearOnMountProps {
  as?: ElementType<any>
  show?: boolean
  children: ((mounted: boolean) => ReactNode) | ReactNode
  enabled?: boolean
  className?: string
}

export const AppearOnMount: FC<AppearOnMountProps> = ({ as = 'div', show, children, enabled = true, className }) => {
  const isMounted = useIsMounted()

  if (!enabled)
    return <>{typeof children === 'function' ? children(isMounted) : children}</>

  if (isMounted) {
    return (
      <Transition
        appear
        as={as}
        className={className}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform scale-90 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        show={show !== undefined ? show : true}
      >
        {typeof children === 'function' ? children(isMounted) : children}
      </Transition>
    )
  }

  return <></>
}
