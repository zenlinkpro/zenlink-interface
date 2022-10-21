import { App, AppType } from '@zenlink-interface/ui'
import { Wallet } from '@zenlink-interface/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { FC } from 'react'
import React from 'react'

export const Header: FC = () => {
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
      </div>
    </App.Header>
  )
}
