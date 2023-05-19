import type { InjectedConnectorOptions, WindowProvider } from '@wagmi/core'
import type { Chain } from 'wagmi'
import { InjectedConnector as WagmiInjectedConnector } from 'wagmi/connectors/injected'

export class InjectedConnector extends WagmiInjectedConnector {
  constructor({ chains, options }: {
    chains?: Chain[]
    options?: InjectedConnectorOptions
  } = {}) {
    super({ chains, options })
  }

  override async getProvider(): Promise<WindowProvider | undefined> {
    return new Promise((resolve) => {
      const provider = this.options.getProvider()
      if (provider) {
        resolve(provider)
      }
      else {
        setTimeout(() => {
          const provider = this.options.getProvider()
          resolve(provider)
        }, 3000)
      }
    })
  }
}
