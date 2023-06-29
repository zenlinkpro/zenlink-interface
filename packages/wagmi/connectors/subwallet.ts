import type { InjectedConnectorOptions, WindowProvider } from '@wagmi/core'
import { ConnectorNotFoundError } from '@wagmi/core'
import { UserRejectedRequestError, getAddress } from 'viem'
import type { Chain } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

declare global {
  interface Window {
    SubWallet?: WindowProvider
  }
}

export class SubWalletConnector extends InjectedConnector {
  readonly id = 'subwallet'
  readonly ready = typeof window !== 'undefined' && !!window.SubWallet

  constructor({ chains, options: _options }: {
    chains?: Chain[]
    options?: InjectedConnectorOptions
  } = {}) {
    super({
      chains,
      options: {
        name: 'SubWallet',
        shimDisconnect: true,
        ..._options,
      },
    })
  }

  async getProvider(): Promise<WindowProvider | undefined> {
    if (typeof window === 'undefined')
      return

    return Promise.resolve(window.SubWallet)
  }

  async getAccount(): Promise<`0x${string}`> {
    const provider = await this.getProvider()
    if (!provider)
      throw new ConnectorNotFoundError()
    let account: `0x${string}` | undefined

    try {
      account = await provider.request({ method: 'eth_accounts' })
        .then((result: string[]) => getAddress(result[0]))
    }
    catch {
      console.warn('eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await provider.request({ method: 'eth_requestAccounts' })
          .then((result: string[]) => getAddress(result[0]))
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
