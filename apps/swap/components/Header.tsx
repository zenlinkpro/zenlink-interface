import { App, AppType } from '@zenlink-interface/ui'
import { NetworkSelector, Profile } from '@zenlink-interface/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { FC } from 'react'
import React from 'react'
import { useAccount } from 'wagmi'
import { useNotifications } from '../lib/state/storage'

export const Header: FC = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      withScrollBackground={true}
      apptype={AppType.Swap}
    >
      <div className="flex items-center gap-2">
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
