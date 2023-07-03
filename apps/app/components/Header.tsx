import { AppSettings } from '@zenlink-interface/compat'
import { App, AppType } from '@zenlink-interface/ui'
import React from 'react'

export const Header = () => {
  return (
    <App.Header
      withScrollBackground={true}
      apptype={AppType.Analytics}
      nav={
        <>
          <App.NavItem href="https://manta-dex-app.vercel.app/swap" label="Swap" />
          <App.NavItem href="https://manta-dex-app.vercel.app/pool" label="Pool" />
        </>
      }
    >
      <AppSettings />
    </App.Header>
  )
}
