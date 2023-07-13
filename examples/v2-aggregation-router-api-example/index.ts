/// <reference lib="dom" />
/* eslint-disable no-console */

import type { Address } from 'viem'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { moonbeam } from 'viem/chains'
import { aggregationRouterV2ABI } from './aggregationRouterV2ABI'
import { erc20ABI } from './erc20ABI'

import 'dotenv/config'

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

async function run() {
  const chainId = 2004 // can also use moonbeam ethereum chainId 1284
  const fromTokenId = 'Native' // can also use '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as Native address
  const toTokenId = '0x931715FEE2d06333043d11F658C8CE934aC61D0c' // USDC.wh address
  const amount = BigInt(10000e18).toString() // 10000 GLMR
  const gasPrice = await publicClient.getGasPrice()
  const priceImpact = 0.01 // 1%

  const routerAddress = '0x3494764d3bE100BA489c8BC5C3438E7629c5e5E5'
  const executorAddress = '0x832B21FA3AA074Ee5328f653D9DB147Bcb155C7a'

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

  // check erc20 allowance
  if (tokenIn !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
    const allowance = await publicClient.readContract({
      address: tokenIn,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [account.address, routerAddress],
    })
    if (allowance < BigInt(amountIn)) {
      console.log('approving aggregation router...')
      const { request } = await publicClient.simulateContract({
        account,
        address: tokenIn,
        abi: erc20ABI,
        functionName: 'approve',
        args: [routerAddress, BigInt(amountIn)],
      })
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })
      console.log('approved!')
    }
  }

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

  if (returnAmount >= BigInt(amountOutMin) && spentAmount === BigInt(amount)) {
    console.log('simulate completed!')
    console.log('sending transaction...')
    const hash = await walletClient.writeContract(request)
    await publicClient.waitForTransactionReceipt({ hash })
    console.log('transaction completed!')
  }
  else {
    console.log('simulate failed, please try again!')
  }
}

run()
