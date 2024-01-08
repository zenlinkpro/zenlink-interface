import { otherChains } from '@zenlink-interface/wagmi-config'
import { createConfig, http } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { coinbaseWallet, injected, safe, walletConnect } from '@wagmi/connectors'
import { createClient } from 'viem'
import { subWallet, talismanWallet } from './connectors'

export const config = createConfig({
  chains: [mainnet, ...otherChains],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'zenlink-interface',
    }),
    walletConnect({
      projectId: '2d54460dfe49ac687751d282d0c54590',
    }),
    talismanWallet(),
    subWallet(),
    safe(),
  ],

})
