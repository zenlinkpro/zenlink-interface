import type { FC } from 'react'

import { MantaDEXIcon } from '../icons'
import type { LoaderProps } from './types'

export const LogoLoader: FC<LoaderProps> = (props) => {
  return <MantaDEXIcon className="animate-heartbeat brightness-0 dark:brightness-100" {...props} />
}
