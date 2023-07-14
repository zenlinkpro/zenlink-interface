# Documentation: V2 Aggregation Swap Examples

This section will give you a walkthrough of the configurations & process for creating and executing Zenlink aggregation swap v2.

[full examples](../examples/v2-aggregation-router-api-example/index.ts)

## Supported Networks/Chains

- Moonbeam 
- Astar (Waiting for upgrade from v1)
- Arbitrum One (Waiting for upgrade from v1)

## Contracts

AggregationRouter

| Network/Chain    | Contract Address                           |
| :--------------- | :----------------------------------------- |
| Moonbeam         | 0x3494764d3bE100BA489c8BC5C3438E7629c5e5E5 |

AggregationExecutor

| Network/Chain    | Contract Address                           |
| :--------------- | :----------------------------------------- |
| Moonbeam         | 0x832B21FA3AA074Ee5328f653D9DB147Bcb155C7a |

## Guide

### 1. Configuration

First things first, we need to configure some required user-specific things (including initialize viem client. [Viem](https://github.com/wagmi-dev/viem) is a typeScript interface for Ethereum):

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

### 2. Define Your Swap Parameters

Next, define the parameters for the swap you want to perform.

```ts
const chainId = 2004 // can also use moonbeam ethereum chainId 1284
const fromTokenId = 'Native' // can also use '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as Native address
const toTokenId = '0x931715FEE2d06333043d11F658C8CE934aC61D0c' // USDC.wh address
const amount = BigInt(10000e18).toString() // 10000 GLMR
const gasPrice = await publicClient.getGasPrice()
const priceImpact = 0.01 // 1%
```

### 3 Define API URLs and fetch route result

Now, define the API URLs and fetch route result including simple description, contract address and contract call parameters.

```ts
const routeResult = await fetch(
    `https://path-finder-git-aggregator-on-moonbeam-zenlink-interface.vercel.app/v2?chainId=${
      chainId
    }&fromTokenId=${
      fromTokenId
    }&toTokenId=${
      toTokenId
    }&amount=${
      amount
    }&gasPrice=${
      Number(gasPrice)
    }&priceImpact=${
      priceImpact
    }&to=${account.address}`,
).then(res => res.json())

console.log(`Route Description: \n${routeResult.routeHumanString}`)

const { tokenIn, amountIn, tokenOut, amountOutMin, to, routeCode, value } = routeResult.routeParams
const routerAddress = routeResult.routerAddress
const executorAddress = routeResult.executorAddress
if (!routerAddress || !executorAddress)
  console.error('Contract address not found')
```

### 4 Check Token Allowance

If srcToken(fromToken) is Native token, we need to check the allowance and create the token allowance (approval) transaction.

```ts
// check erc20 allowance
if (tokenIn !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
  const allowance = await publicClient.readContract({
    address: tokenIn,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [account.address, routerAddress],
  })
  if (allowance < BigInt(amountIn)) {
    const { request } = await publicClient.simulateContract({
      account,
      address: tokenIn,
      abi: erc20ABI,
      functionName: 'approve',
      args: [routerAddress, BigInt(amountIn)],
    })
    const hash = await walletClient.writeContract(request)
    console.log('Approving Aggregation Router: ', hash)
    await publicClient.waitForTransactionReceipt({ hash })
    console.log('Approved!')
  }
}
```

### 5. Making the Swap

Before proceeding, please confirm that your approval transaction has a status of Success!

<details>
<summary>AggregationRouterV2ABI</summary>

```ts
const aggregationRouterV2ABI = [
  {
    inputs: [
      {
        internalType: 'contract IAggregationExecutor',
        name: 'executor',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'Currency',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'Currency',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'dstReceiver',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minReturnAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct AggregationRouter.SwapDescription',
        name: 'desc',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
    ],
    name: 'swap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'spentAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
```

</details>

```ts
const { result: [returnAmount, spentAmount], request } = await publicClient.simulateContract({
  address: routerAddress,
  abi: aggregationRouterV2ABI,
  functionName: 'swap',
  account,
  args: [
    executorAddress,
    {
      srcToken: tokenIn,
      dstToken: tokenOut,
      amount: BigInt(amountIn),
      dstReceiver: to,
      minReturnAmount: BigInt(amountOutMin),
    },
    routeCode,
  ],
  value: BigInt(value || '0'),
})

// check simulate result
if (returnAmount >= BigInt(amountOutMin) && spentAmount === BigInt(amount)) {
  console.log('Simulate Completed!')
  const hash = await walletClient.writeContract(request)
  console.log('Transaction Signed and Sent: ', hash)
  await publicClient.waitForTransactionReceipt({ hash })
  console.log('Transaction Completed, Swap tx hash: ', hash)
}
else {
  console.log('Simulate failed, please try again!')
}
```

After running this code in the console, you should see something like this

`Transaction Completed, Swap tx hash: 0xe90955ddec325e26f274f6467e92bbd43753173a5bac877b30e0d835055f9d02`

Let's check the result of the transaction on the explorer: https://moonbeam.moonscan.io/tx/0xe90955ddec325e26f274f6467e92bbd43753173a5bac877b30e0d835055f9d02

