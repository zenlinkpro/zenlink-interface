import { AppSettings } from '@zenlink-interface/compat'
import { App, AppType } from '@zenlink-interface/ui'
import React from 'react'

export function Header() {
  return (
    <App.Header
      withScrollBackground={true}
      apptype={AppType.Analytics}
      maxWidth="6xl"
      nav={(
        <>
          <App.NavItem href="https://app.zenlink.pro/swap" label="Swap" />
          <App.NavItem href="https://app.zenlink.pro/pool" label="Pools" />
          <App.NavItem href="https://app.zenlink.pro/referrals" label="Referrals" />
        </>
      )}
    >
      <AppSettings />
    </App.Header>
  )
}
