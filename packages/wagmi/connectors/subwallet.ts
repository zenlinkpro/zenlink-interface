import { injected } from '@wagmi/core'

interface Window {
  SubWallet?: any
}

export function subWallet() {
  return injected({
    target() {
      return {
        id: 'subwallet',
        name: 'SubWallet',
        provider: (window as Window).SubWallet,
      }
    },
  })
}
