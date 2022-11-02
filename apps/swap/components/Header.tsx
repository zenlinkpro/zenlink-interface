import { App, AppType } from '@zenlink-interface/ui'
import { NotificationCentre, Wallet } from '@zenlink-interface/wagmi'
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
        <Wallet.Button
          size="sm"
          className="border-none shadow-md whitespace-nowrap"
          supportedNetworks={SUPPORTED_CHAIN_IDS}
        />
        <NotificationCentre notifications={notifications} clearNotifications={clearNotifications} />
      </div>
    </App.Header>
  )
}
