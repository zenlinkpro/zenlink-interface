import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

interface UseWalletStateReturn {
  isConnected: boolean
  isDisconnected: boolean
  connecting: boolean
  notConnected: boolean
  pendingConnection: boolean
  reconnecting: boolean
}

type UseWalletState = (pendingConnector: boolean) => UseWalletStateReturn

// Mutually exclusive states
// TODO ramin: remove pendingConnector param when wagmi adds onConnecting callback to useAccount
export const useWalletState: UseWalletState = (pendingConnector) => {
  const [initialDc, setInitialDc] = useState(true)

  const { address, isConnecting, isReconnecting, isConnected, isDisconnected } = useAccount()

  // Trying to see if wallet is connected
  const connecting = useMemo(
    () => Boolean(isConnecting && !isReconnecting && !pendingConnector && !address) || initialDc,
    [address, initialDc, isConnecting, isReconnecting, pendingConnector],
  )

  // No wallet connected
  const notConnected = useMemo(
    () => Boolean(!isConnecting && !isReconnecting && !pendingConnector && !address),
    [address, isConnecting, isReconnecting, pendingConnector],
  )

  // pending wallet confirmation
  const pendingConnection = useMemo(
    () => Boolean(isConnecting && !isReconnecting && pendingConnector && !address),
    [address, isConnecting, isReconnecting, pendingConnector],
  )

  // We are reconnecting
  const reconnecting = useMemo(
    () => Boolean(isReconnecting && address),
    [address, isReconnecting],
  )

  useEffect(() => {
    if (initialDc && connecting)
      setInitialDc(false)
  }, [connecting, initialDc])

  return {
    isConnected,
    isDisconnected,
    connecting,
    notConnected,
    pendingConnection,
    reconnecting,
  }
}
