import type { FC } from 'react'

import { ZenlinkIcon } from '../icons'
import type { LoaderProps } from './types'

export const LogoLoader: FC<LoaderProps> = (props) => {
  return <ZenlinkIcon className="animate-heartbeat" {...props} />
}
