import type { FC } from 'react'

import type { LoaderProps } from './types'
import { ZenlinkIcon } from '../icons'

export const LogoLoader: FC<LoaderProps> = (props) => {
  return <ZenlinkIcon className="animate-heartbeat" {...props} />
}
