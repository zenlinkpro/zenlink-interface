import SafeAppsSDK from '@safe-global/safe-apps-sdk/dist/src/sdk'
import type { Hash } from 'viem'
import type { Chain } from 'wagmi'
import type { SafeConnectorOptions, SafeConnectorProvider } from 'wagmi/connectors/safe'
import { SafeConnector } from 'wagmi/connectors/safe'

export class MultisigSafeConnector extends SafeConnector {
  readonly id = 'safe'
  readonly name = 'Safe'
  // Only allowed in iframe context
  ready = !(typeof window === 'undefined') && window?.parent !== window

  #provider?: SafeConnectorProvider
  #sdk: SafeAppsSDK

  protected shimDisconnectKey = `${this.id}.shimDisconnect`

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[]
    options?: SafeConnectorOptions
  }) {
    super({ chains, options: options_ })

    let SDK = SafeAppsSDK
    if (
      typeof SafeAppsSDK !== 'function'
      // @ts-expect-error This import error is not visible to TypeScript
      && typeof SafeAppsSDK.default === 'function'
    )
      SDK = (SafeAppsSDK as unknown as { default: typeof SafeAppsSDK }).default

    this.#sdk = new SDK()
  }

  async getHashBySafeTxHash(safeHash: Hash, maxAttempts = 20, pollingInterval = 2000) {
    let attempts = 0
    let txHash
    while (attempts < maxAttempts) {
      txHash = (await this.#sdk.txs.getBySafeTxHash(safeHash)).txHash
      if (txHash)
        return txHash as Hash
      await new Promise(resolve => setTimeout(resolve, pollingInterval))
      attempts++
    }
  }
}
