# Documentation: V2 Aggregation Swap Examples

This section will give you a walkthrough of the configurations & process for creating and executing Zenlink aggregation swap v2.

[full examples](../examples/v2-aggregation-router-api-example/index.ts)

### 1. Configuration

First things first, we need to configure some required user-specific things:

- The chainConfig of an Ethereum node to connect to
- The private key of the account to trade

```ts
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { moonbeam } from 'viem/chains'
import type { Address } from 'viem'

const account = privateKeyToAccount(process.env.PRIVATE_KEY as Address)
const chainConfig = {
  chain: moonbeam,
  transport: http(moonbeam.rpcUrls.default.http[0]),
}
const publicClient = createPublicClient(chainConfig)
const walletClient = createWalletClient({
  account,
  ...chainConfig,
})
```
