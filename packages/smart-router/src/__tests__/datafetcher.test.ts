import { ParachainId } from "@zenlink-interface/chain"
import { USDC, WETH9 } from "@zenlink-interface/currency"
import { afterAll, beforeAll, expect, describe, it } from "vitest"
import { DataFetcher } from "../fetchers"
import {LiquidityProviders, NativeWrapProvider } from "../liquidity-providers"
import { Chain, createPublicClient, http } from "viem"
import { arbitrum } from "@zenlink-interface/wagmi-config"
import { Router } from "../routers"
import { BigNumber } from "@ethersproject/bignumber"

const DATA_FETCHER = new DataFetcher(
  ParachainId.ARBITRUM_ONE,
  createPublicClient({
    chain: arbitrum as Chain,
    transport: http(arbitrum.rpcUrls.default.http[0]),
  })
)
const DEFAULT_PROVIDERS = [
  // LiquidityProviders.Zenlink, 
  // LiquidityProviders.Sirius, 
  // LiquidityProviders.ZenlinkStableSwap,
  // LiquidityProviders.Gmx,
  LiquidityProviders.TraderJoeV2,
  // LiquidityProviders.SushiSwap
]

beforeAll(() => {
  expect(DATA_FETCHER).toBeInstanceOf(DataFetcher)
  DATA_FETCHER.startDataFetching(DEFAULT_PROVIDERS)
})

afterAll(() => {
  DATA_FETCHER.stopDataFetching()
})

describe('DataFetcher', () => {
  it('should have providers', async () => {
    const providers = DATA_FETCHER.providers
    expect(providers[0]).toBeInstanceOf(NativeWrapProvider)
  })

  it('should have the default state', async () => {
    expect(DATA_FETCHER.getCurrentPoolStateId(DEFAULT_PROVIDERS)).toBe(0)
  })

  const token0 = WETH9[ParachainId.ARBITRUM_ONE]
  const token1 = USDC[ParachainId.ARBITRUM_ONE]

  it.skip(`should fetch pools for ${token0.symbol} and ${token1.symbol}`, async () => {
    DATA_FETCHER.startDataFetching(DEFAULT_PROVIDERS)
    await DATA_FETCHER.fetchPoolsForToken(token0, token1)
    const router = new Router(
      DATA_FETCHER,
      token0,
      BigNumber.from('1000000000000'),
      token1,
      30e9,
    )
    router.startRouting(() => {
      router.stopRouting()
      DATA_FETCHER.stopDataFetching()
    })
  
    const bestRoute = router.getBestRoute()
    console.log(bestRoute)
  })

  it.skip('should have a block', async () => {
    const blockNumber = DATA_FETCHER.getLastUpdateBlock()
    await new Promise((r) => setTimeout(r, 500))
    expect(blockNumber).toBeGreaterThan(0)
    expect(blockNumber).not.toBeUndefined
  })
})
