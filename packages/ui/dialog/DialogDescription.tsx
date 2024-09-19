import type { FC } from 'react'
import type { ExtractProps } from '../types'
import { Description } from '@headlessui/react'

import classNames from 'classnames'

export type DialogDescriptionProps = ExtractProps<typeof Description>

const DialogDescription: FC<DialogDescriptionProps> = ({ className, ...props }) => {
  return (
    <Description
      {...props}
      className={classNames(className, 'text-sm text-slate-500 dark:text-slate-400')}
    />
  )
}

export default DialogDescription
