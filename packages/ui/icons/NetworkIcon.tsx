import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import React, { useMemo } from 'react'

import { NETWORK_CIRCLE_ICON, NETWORK_NAKED_ICON } from './network'

interface Props extends React.ComponentProps<'svg'> {
  type?: 'naked' | 'circle'
  chainId: ParachainId
}

export const NetworkIcon: FC<Props> = ({ type = 'circle', chainId, ...props }) => {
  const Icon = useMemo(() => {
    if (type === 'naked')
      return NETWORK_NAKED_ICON[chainId]

    return NETWORK_CIRCLE_ICON[chainId]
  }, [chainId, type])

  if (Icon)
    return <Icon {...props} />

  return <></>
}
