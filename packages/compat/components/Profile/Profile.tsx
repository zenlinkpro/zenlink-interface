import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { Profile as WagmiProfile } from '@zenlink-interface/wagmi'
import { isEvmNetwork } from '../../config'

interface ProfileProps {
  parachainId: ParachainId
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>
  clearNotifications(): void
}

export const Profile: FC<ProfileProps> = ({
  notifications,
  clearNotifications,
  supportedNetworks,
  parachainId,
}) => {
  if (isEvmNetwork(parachainId)) {
    return (
      <WagmiProfile
        notifications={notifications}
        clearNotifications={clearNotifications}
        supportedNetworks={supportedNetworks}
      />
    )
  }

  // if (isSubstrateNetwork(parachainId)) {
  //   return (
  //     <Wallet.Button></Wallet.Button>
  //   )
  // }

  return <span />
}
