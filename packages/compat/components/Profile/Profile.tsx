import { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { Profile as WagmiProfile } from '@zenlink-interface/wagmi'
import { Profile as BifrostProfile } from '@zenlink-interface/parachains-bifrost'
import { Profile as AmplitudeProfile } from '@zenlink-interface/parachains-amplitude'
import { useSettings } from '@zenlink-interface/shared'
import { isEvmNetwork, isSubstrateNetwork } from '../../config'

interface ProfileProps {
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>

  clearNotifications(): void
}

export const Profile: FC<ProfileProps> = ({
  supportedNetworks,
  notifications,
  clearNotifications,
}) => {
  const [{ parachainId }] = useSettings()

  if (isEvmNetwork(parachainId)) {
    return (
            <WagmiProfile
                notifications={notifications}
                clearNotifications={clearNotifications}
                supportedNetworks={supportedNetworks}
            />
    )
  }

  if (isSubstrateNetwork(parachainId)) {
    if (parachainId === ParachainId.AMPLITUDE) {
      return (
                <AmplitudeProfile
                    parachainId={parachainId}
                    notifications={notifications}
                    clearNotifications={clearNotifications}
                    supportedNetworks={supportedNetworks}
                />
      )
    }
    else {
      return (
                <BifrostProfile
                    parachainId={parachainId}
                    notifications={notifications}
                    clearNotifications={clearNotifications}
                    supportedNetworks={supportedNetworks}
                />
      )
    }
  }

  return <span/>
}
