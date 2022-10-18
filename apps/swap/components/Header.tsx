import { App, AppType } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React from 'react'

export const Header: FC = () => {
  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItem href="https://www.sushi.com/swap" label="Swap" />
          <App.NavItem href={'https://www.sushi.com/earn'} label="Earn" />
        </App.NavItemList>
      }
    >
    </App.Header>
  )
}
