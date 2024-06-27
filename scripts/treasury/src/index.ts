import { privateKeyToAccount } from 'viem/accounts'
import { type Address, createPublicClient, createWalletClient, fallback, http } from 'viem'
import { moonbeam } from 'viem/chains'
import { ParachainId } from '@zenlink-interface/chain'
import { erc20, market, syBase, treasury } from '../abis'
import { SwapType } from './types'
import { markets } from './markets'

import 'dotenv/config'

const account = privateKeyToAccount(process.env.ACCOUNT as Address)
const publicClient = createPublicClient({
  chain: moonbeam,
  transport: fallback([
    http(moonbeam.rpcUrls.default.http[0]),
  ]),
})
const walletClient = createWalletClient({
  account,
  chain: moonbeam,
  transport: fallback([
    http(moonbeam.rpcUrls.default.http[0]),
  ]),
})
const priceImpact = 0.01 // 1%

const treasuryAddress = '0x9a607a7337211D1C8bC157be6CC5E8b0ae4a9AE6'
const DOTAddress = '0xffffffff1fcacbd218edc0eba20fc2308c778080'

async function distribute(marketAddress: Address) {
  try {
    const [syAddress] = await publicClient.readContract({
      address: marketAddress,
      abi: market,
      functionName: 'readTokens',
    })

    const balance = await publicClient.readContract({
      address: syAddress,
      abi: erc20,
      functionName: 'balanceOf',
      args: [treasuryAddress],
    })

    if (balance === BigInt(0)) {
      console.log(`0 sy balance of ${marketAddress}`)
      return
    }

    const yieldToken = await publicClient.readContract({
      address: syAddress,
      abi: syBase,
      functionName: 'yieldToken',
    })

    const gasPrice = await publicClient.getGasPrice()

    const {
      routeParams,
      routerAddress,
      executorAddress,
    } = await fetch(
      `https://path-finder.zenlink.pro/v2?chainId=${ParachainId.MOONBEAM
      }&fromTokenId=${yieldToken
      }&toTokenId=${DOTAddress
      }&amount=${balance.toString()
      }&gasPrice=${Number(gasPrice)
      }&priceImpact=${priceImpact
      }&to=${treasuryAddress}`,
    ).then(res => res.json() as any)

    const { routeCode } = routeParams

    const hash = await walletClient.writeContract({
      address: treasuryAddress,
      abi: treasury,
      functionName: 'redeemSyToToken',
      args: [
        marketAddress,
        {
          tokenOut: DOTAddress,
          minTokenOut: BigInt(1),
          tokenRedeemSy: yieldToken,
          zenlinkSwap: routerAddress,
          swapData: {
            swapType: SwapType.ZENLINK,
            executor: executorAddress,
            route: routeCode,
          },
        },
      ],
    })

    await publicClient.waitForTransactionReceipt({ hash })

    console.log(`Successfully distribute pool ${marketAddress}`)
  }
  catch {
    console.log(`Something wrong when distribute pool ${marketAddress}:`)
  }
}

async function main() {
  for (const market of markets) {
    await distribute(market)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
