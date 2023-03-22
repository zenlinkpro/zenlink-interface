# Path Finder API ![license](https://img.shields.io/badge/License-MIT-green.svg?label=license)

## Usage

### V0

tokenId of NativeToken is 'Native' or address '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

Types

```ts
interface QueryParams {
  chainId: number
  fromTokenId: string
  toTokenId: string
  gasPrice: number
  amount: string
  to?: string
  priceImpact?: number
}
```

Example

```ts
const res = await (
  await fetch(`
    ${API_URL}/v0?chainId=${
      chainId
    }&fromTokenId=${
      Native | address
    }&toTokenId=${
      Native | address
    }&amount=${
      amount
    }&gasPrice=${
      gasPrice
    }&priceImpact=${
      slippageTolerance / 100
    }${recipient ? `&to=${recipient}` : ''}`
  ).json()
)
```

Response
```as
{
  "bestRoute": {
    "status": "Success",
    "fromToken": {
      "chainId": 2006,
      "decimals": 18,
      "symbol": "ASTR",
      "name": "Astar",
      "isNative": true,
      "isToken": false
    },
    "toToken": {
      "chainId": 2006,
      "decimals": 6,
      "symbol": "USDC",
      "name": "USD Coin",
      "isNative": false,
      "isToken": true,
      "address": "0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98",
      "tokenId": "0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98-2006"
    },
    "primaryPrice": 6.902055717468347e-14,
    "swapPrice": 6.874363141229752e-14,
    "amountIn": 1.0000000000000004e+22,
    "amountInBN": "10000000000000000000000",
    "amountOut": 687436314.1229752,
    "amountOutBN": "687436314",
    "priceImpact": 0.004012221484753775,
    "totalAmountOut": 687436072.5510253,
    "totalAmountOutBN": "687436073",
    "gasSpent": 350000,
    "legs": [
      {
        "poolAddress": "0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720",
        "poolType": "Unknown",
        "poolFee": 0,
        "tokenFrom": {
          "address": "",
          "name": "Astar",
          "symbol": "ASTR",
          "chainId": 2006,
          "tokenId": "-2006"
        },
        "tokenTo": {
          "chainId": 2006,
          "decimals": 18,
          "symbol": "WASTR",
          "name": "Wrapped Astar",
          "isNative": false,
          "isToken": true,
          "address": "0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720",
          "tokenId": "0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720-2006"
        },
        "assumedAmountIn": 1e+22,
        "assumedAmountOut": 1e+22,
        "swapPortion": 1,
        "absolutePortion": 1,
        "protocol": "Wrap"
      },
      ....
    ]
  },
  "routeParams": {
    "tokenIn": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "amountIn": "10000000000000000000000",
    "tokenOut": "0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98",
    "amountOutMin": "683999132",
    "to": "0x...",
    "routeCode": "...",
    "value": "10000000000000000000000"
  }
}
```
