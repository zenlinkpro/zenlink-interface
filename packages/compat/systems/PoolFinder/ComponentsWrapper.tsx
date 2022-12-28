import type { FC } from 'react'

import type { ComponentsWrapperProps, StandardPoolFinderProps } from './types'

export const ComponentsWrapper: FC<ComponentsWrapperProps<StandardPoolFinderProps>> = ({
  children,
}) => {
  return <>{children}</>
}
