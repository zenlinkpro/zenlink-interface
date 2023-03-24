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
      withScrollBackground={true}
      apptype={AppType.Swap}
    >
      <div className="flex items-center gap-0.5 md:gap-2">
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
