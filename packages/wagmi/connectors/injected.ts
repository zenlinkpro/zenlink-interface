import type { InjectedConnectorOptions, WindowProvider } from '@wagmi/core'
import { ConnectorNotFoundError } from '@wagmi/core'
import { UserRejectedRequestError, getAddress } from 'viem'
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
        const throwNoEthereumError = setTimeout(() => {
          resolve(undefined)
        }, 3000)

        window.addEventListener('ethereum#initialized', () => {
          clearTimeout(throwNoEthereumError)
          const provider = this.options.getProvider()

          resolve(provider)
        }, { once: true })
      }
    })
  }

  override async getAccount(): Promise<`0x${string}`> {
    const provider = await this.getProvider()
    if (!provider)
      throw new ConnectorNotFoundError()
    let account: `0x${string}` | undefined

    try {
      account = await provider.request({ method: 'eth_accounts' })
        .then(result => getAddress(result[0]))
    }
    catch {
      console.warn('eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await provider.request({ method: 'eth_requestAccounts' })
          .then(result => getAddress(result[0]))
      }
      catch {
        console.warn('enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account)
      throw new UserRejectedRequestError(new Error('Fail to get accounts list'))

    return account
  }
}
