import { AppSettings } from '@zenlink-interface/compat'
import { App, AppType } from '@zenlink-interface/ui'
import React from 'react'

export function Header() {
  return (
    <App.Header
      apptype={AppType.Analytics}
      maxWidth="6xl"
      nav={(
        <>
          <App.NavItem href="https://app.zenlink.pro/swap" label="Swap" />
          <App.NavItem href="https://app.zenlink.pro/pool" label="Pools" />
          <div className="relative">
            <span className="absolute -top-[12px] right-0">🔥</span>
            <App.NavItem href="https://app.zenlink.pro/market" label="Eden" />
          </div>
          <div className="relative">
            <span className="absolute -top-[12px] right-0">🔥</span>
            <App.NavItem href="https://app.zenlink.pro/gauge" label="Gauge" />
          </div>
        </>
      )}
      withScrollBackground={true}
    >
      <AppSettings />
    </App.Header>
  )
}
