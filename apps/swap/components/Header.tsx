import type { FC } from 'react'
import { AppSettings, NetworkSelector, Profile, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { App, AppType } from '@zenlink-interface/ui'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React from 'react'

export const Header: FC = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      apptype={AppType.Swap}
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
