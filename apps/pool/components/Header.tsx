import { NetworkSelector } from '@zenlink-interface/compat'
import { App, AppType } from '@zenlink-interface/ui'
import { Profile } from '@zenlink-interface/wagmi'
import React from 'react'
import { useAccount } from 'wagmi'
import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications, useSettings } from '../lib/state/storage'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)
  const [{ parachainId }, { updateParachainId }] = useSettings()

  return (
    <App.Header
      apptype={AppType.Pool}
    >
      <div className="flex gap-2">
        <NetworkSelector
          supportedNetworks={SUPPORTED_CHAIN_IDS}
          parachainId={parachainId}
          updateParachainId={updateParachainId}
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
