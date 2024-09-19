import type { FC } from 'react'
import type { Chains } from '../config/chain'

import React, { useMemo } from 'react'
import { CROSS_TRANSFER_NETWORK_CIRCLE_ICON, CROSS_TRANSFER_NETWORK_NAKED_ICON } from './network'

interface Props extends React.ComponentProps<'svg'> {
  type?: 'naked' | 'circle'
  chain: Chains
}

export const NetworkIcon: FC<Props> = ({ type = 'circle', chain, ...props }) => {
  const Icon = useMemo(() => {
    if (type === 'naked')
      return CROSS_TRANSFER_NETWORK_NAKED_ICON[chain]

    return CROSS_TRANSFER_NETWORK_CIRCLE_ICON[chain]
  }, [chain, type])

  if (Icon)
    return <Icon {...props} />

  return <></>
}
