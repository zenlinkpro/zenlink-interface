import type { FC } from 'react'
import type { ExtractProps } from '../types'
import { Label } from '@headlessui/react'
import classNames from 'classnames'

import React, { Fragment } from 'react'
import { Typography } from '../typography'

export type SelectLabelProps = ExtractProps<typeof Label> & {
  children: string
  standalone?: boolean
}

const SelectLabel: FC<SelectLabelProps> = ({ className, children, standalone, ...props }) => {
  return React.createElement(
    standalone ? 'div' : Label,
    {
      ...props,
      as: Fragment,
    },
    <Typography className={classNames(className, 'text-high-emphesis')} variant="sm" weight={500}>
      {children}
    </Typography>,
  )
}

export default SelectLabel
