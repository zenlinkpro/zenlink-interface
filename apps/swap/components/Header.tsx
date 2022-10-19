import { App, AppType } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React from 'react'

export const Header: FC = () => {
  return (
    <App.Header
      withScrollBackground={true}
      apptype={AppType.Swap}
    >
    </App.Header>
  )
}
