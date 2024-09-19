import { otherChains } from '@zenlink-interface/wagmi-config'
import { createClient } from 'viem'
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { coinbaseWallet, injected, safe, walletConnect } from 'wagmi/connectors'
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
