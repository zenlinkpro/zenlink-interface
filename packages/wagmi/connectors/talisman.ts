import type { Chain, InjectedConnectorOptions, WindowProvider } from '@wagmi/core'
import { ConnectorNotFoundError } from '@wagmi/core'
import { UserRejectedRequestError, getAddress } from 'viem'
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
