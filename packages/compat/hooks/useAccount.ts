import { wagmi } from '@zenlink-interface/wagmi'
import { useAccount as usePolkadotAccount } from '@zenlink-interface/polkadot'
import { useMemo } from 'react'
import { useSettings } from '@zenlink-interface/shared'
import { isEvmNetwork } from '../config'

export function useAccount() {
  const { useAccount: useWagmiAccount } = wagmi
  const [{ parachainId }] = useSettings()
  const wagmiAccount = useWagmiAccount()
  const polkadotAccount = usePolkadotAccount()

  return useMemo(() => {
    if (isEvmNetwork(parachainId)) {
      return {
        address: wagmiAccount.address,
        isConnecting: wagmiAccount.isConnecting,
        isConnected: wagmiAccount.isConnected,
        select: () => {},
      }
    }
    else {
      return {
        address: polkadotAccount.address,
        isConnecting: polkadotAccount.isConnecting,
        isConnected: polkadotAccount.isConnected,
        select: polkadotAccount.select,
      }
    }
  }, [parachainId, polkadotAccount, wagmiAccount])
}
