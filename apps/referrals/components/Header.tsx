import { AppSettings, NetworkSelector, Profile, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { App, AppType } from '@zenlink-interface/ui'
import React from 'react'
import { SUPPORTED_CHAIN_IDS } from '../config'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      withScrollBackground={true}
      apptype={AppType.Referrals}
      nav={
        <>
          <App.NavItem href="https://manta-dex-app.vercel.app/swap" label="Swap" />
          <App.NavItem href="https://manta-dex-app.vercel.app/pool" label="Pool" />
        </>
      }
    >
      <div className="flex items-center gap-2">
        <AppSettings />
        <NetworkSelector supportedNetworks={SUPPORTED_CHAIN_IDS} />
        <Profile
          supportedNetworks={SUPPORTED_CHAIN_IDS}
          notifications={notifications}
          clearNotifications={clearNotifications}
        />
      </div>
    </App.Header>
  )
}
