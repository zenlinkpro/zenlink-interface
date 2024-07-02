import { AppSettings, NetworkSelector, Profile, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { App, AppType } from '@zenlink-interface/ui'
import React from 'react'
import { SUPPORTED_CHAIN_IDS } from '../config'

export function Header() {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      apptype={AppType.Pool}
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
      withScrollBackground
    >
      <div className="flex items-center gap-2">
        <AppSettings />
        <NetworkSelector supportedNetworks={SUPPORTED_CHAIN_IDS} />
        <Profile
          clearNotifications={clearNotifications}
          notifications={notifications}
          supportedNetworks={SUPPORTED_CHAIN_IDS}
        />
      </div>
    </App.Header>
  )
}
