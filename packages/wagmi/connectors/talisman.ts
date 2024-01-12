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
        provider: typeof window !== 'undefined' ? (window as Window)?.talismanEth : undefined,
      }
    },
  })
}
