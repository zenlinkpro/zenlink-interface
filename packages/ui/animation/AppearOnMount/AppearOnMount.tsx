import { Transition } from '@headlessui/react'
import { useIsMounted } from '@zenlink-interface/hooks'
import classNames from 'classnames'
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
        show={show !== undefined ? show : true}
      >
        <div className={classNames(
          'transition duration-300 origin-center ease-out data-[closed]:scale-90 data-[closed]:opacity-0',
          className,
        )}
        >
          {typeof children === 'function' ? children(isMounted) : children}
        </div>
      </Transition>
    )
  }

  return <></>
}
