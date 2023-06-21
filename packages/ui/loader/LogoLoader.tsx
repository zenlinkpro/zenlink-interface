import type { FC } from 'react'

import { MantaWalletIcon } from '../icons'
import type { LoaderProps } from './types'

export const LogoLoader: FC<LoaderProps> = (props) => {
  return <MantaWalletIcon className="animate-heartbeat" {...props} />
}
