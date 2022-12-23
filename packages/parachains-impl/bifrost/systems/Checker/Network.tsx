import type { FC, ReactElement } from 'react'

import type { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children }): ReactElement<any, any> | null => {
  if (!chainId)
    return null

  return <>{children}</>
}
