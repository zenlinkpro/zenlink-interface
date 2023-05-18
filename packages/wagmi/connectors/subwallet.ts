import type { InjectedConnectorOptions, WindowProvider } from '@wagmi/core'
import type { Chain } from 'wagmi'
import { ConnectorNotFoundError } from 'wagmi'
import type { RpcError } from 'viem'
import { ResourceUnavailableRpcError, UserRejectedRequestError } from 'viem'
import { InjectedConnector } from 'wagmi/connectors/injected'

declare global {
  interface Window {
    SubWallet?: WindowProvider
  }
}

export class SubWalletConnector extends InjectedConnector {
  override readonly id = 'subwallet'
  override readonly ready = typeof window !== 'undefined' && !!window.SubWallet

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

  override async connect({ chainId }: { chainId?: number } = {}): Promise<{
    account: `0x${string}`
    chain: {
      id: number
      unsupported: boolean
    }
    provider: WindowProvider
  }> {
    try {
      const provider = await this.getProvider()

      if (!provider)
        throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)

        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return { account, chain: { id, unsupported }, provider }
    }
    catch (e) {
      if (this.isUserRejectedRequestError(e))
        throw new UserRejectedRequestError(e as Error)

      if ((<RpcError>e).code === -32002)
        throw new ResourceUnavailableRpcError(e as Error)

      throw e
    }
  }

  override async getProvider(): Promise<WindowProvider | undefined> {
    if (typeof window === 'undefined')
      return

    return Promise.resolve(window.SubWallet)
  }
}
