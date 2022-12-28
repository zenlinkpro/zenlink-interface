import type { Ethereum } from '@wagmi/core'

declare global {
  interface Window {
    SubWallet?: Ethereum
    talismanEth?: Ethereum
  }
}
