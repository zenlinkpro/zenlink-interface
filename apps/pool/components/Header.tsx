import { NetworkSelector } from '@zenlink-interface/compat'
import { App, AppType } from '@zenlink-interface/ui'
import { Profile } from '@zenlink-interface/wagmi'
import React from 'react'
import { useAccount } from 'wagmi'
import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      apptype={AppType.Pool}
    >
      <div className="flex gap-2">
        <NetworkSelector
          supportedNetworks={SUPPORTED_CHAIN_IDS}
        />
        <Profile
          supportedNetworks={SUPPORTED_CHAIN_IDS}
          notifications={notifications}
          clearNotifications={clearNotifications}
        />
      </div>
    </App.Header>
  )
}
