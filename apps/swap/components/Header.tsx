import { App, AppType } from '@zenlink-interface/ui'
import { AppSettings, NetworkSelector, Profile, useAccount } from '@zenlink-interface/compat'
import type { FC } from 'react'
import React from 'react'
import { useNotifications } from '@zenlink-interface/shared'
import { SUPPORTED_CHAIN_IDS } from 'config'

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
          <App.NavItem href="https://app.zenlink.pro/referrals" label="Referrals" />
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
