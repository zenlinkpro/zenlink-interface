import type { FC } from 'react'

import { MantaDEXIcon } from '../icons'
import type { LoaderProps } from './types'

export const LogoLoader: FC<LoaderProps> = (props) => {
  return <MantaDEXIcon className="animate-heartbeat" {...props} />
}
