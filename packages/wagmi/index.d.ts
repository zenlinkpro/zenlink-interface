import type { Ethereum } from '@wagmi/core'

export {}

declare global {
  interface Window {
    SubWallet?: Ethereum
    talismanEth?: Ethereum
  }
}
