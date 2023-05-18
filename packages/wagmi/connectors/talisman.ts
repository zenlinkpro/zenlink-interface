import type { Chain, InjectedConnectorOptions, WindowProvider } from '@wagmi/core'
import { InjectedConnector } from 'wagmi/connectors/injected'

declare global {
  interface Window {
    talismanEth?: WindowProvider
  }
}

export type TalismanConnectorOptions = InjectedConnectorOptions & {
  // nothing for now
}

export class TalismanConnector extends InjectedConnector {
  readonly id = 'talisman'
  readonly ready = typeof window != 'undefined' && !!window.talismanEth

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[]
    options?: TalismanConnectorOptions
  } = {}) {
    super({
      chains,
      options: {
        name: 'Talisman',
        shimDisconnect: true,
        ...options_,
      },
    })
  }

  async getProvider(): Promise<WindowProvider | undefined> {
    if (typeof window === 'undefined')
      return
    return window.talismanEth
  }
}
