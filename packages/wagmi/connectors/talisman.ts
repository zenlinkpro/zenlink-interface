import { injected } from 'wagmi/connectors'

interface Window {
  talismanEth?: any
}

export function talismanWallet() {
  return injected({
    target() {
      return {
        id: 'talisman',
        name: 'Talisman',
        provider: (window as Window).talismanEth,
      }
    },
  })
}
