import { injected } from 'wagmi/connectors'

interface Window {
  SubWallet?: any
}

export function subWallet() {
  return injected({
    target() {
      return {
        id: 'subwallet',
        name: 'SubWallet',
        provider: typeof window !== 'undefined' ? (window as Window).SubWallet : undefined,
      }
    },
  })
}
