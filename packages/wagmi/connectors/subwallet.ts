import type { Ethereum } from '@wagmi/core'
import type { Chain, RpcError } from 'wagmi'
import { ConnectorNotFoundError, ResourceUnavailableError, UserRejectedRequestError } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import type { TalismanConnectorOptions } from './talisman'

declare global {
  interface Window {
    SubWallet?: Ethereum
  }
}

export class SubWalletConnector extends InjectedConnector {
  override readonly id = 'subwallet'
  override readonly ready = typeof window !== 'undefined' && !!window.SubWallet

  constructor({ chains, options: _options }: {
    chains?: Chain[]
    options?: TalismanConnectorOptions
  } = {}) {
    super({
      chains,
      options: {
        name: 'SubWallet',
        shimDisconnect: true,
        shimChainChangedDisconnect: true,
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
    provider: Ethereum
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
        throw new UserRejectedRequestError(e)

      if ((<RpcError>e).code === -32002)
        throw new ResourceUnavailableError(e)

      throw e
    }
  }

  override async getProvider(): Promise<Ethereum | undefined> {
    if (typeof window === 'undefined')
      return

    return Promise.resolve(window.SubWallet)
  }
}
