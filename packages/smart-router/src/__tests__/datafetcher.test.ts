import { ParachainId } from "@zenlink-interface/chain"
import { USDC, USDT, WNATIVE, ZLK } from "@zenlink-interface/currency"
import { afterAll, beforeAll, expect, describe, it } from "vitest"
import { DataFetcher } from "../fetchers"
import { LiquidityProviders, NativeWrapProvider } from "../liquidity-providers"
import { Chain, createPublicClient, http } from "viem"
import { moonbeam, scroll } from "@zenlink-interface/wagmi-config"
import { Router } from "../routers"
import { BigNumber } from "@ethersproject/bignumber"

const DATA_FETCHER = new DataFetcher(
  ParachainId.MOONBEAM,
  createPublicClient({
    chain: moonbeam as Chain,
    transport: http(moonbeam.rpcUrls.default.http[0]),
  })
)
const DEFAULT_PROVIDERS = [
  LiquidityProviders.StellaSwapV4,
  // LiquidityProviders.Sirius, 
  // LiquidityProviders.ZenlinkStableSwap,
  // LiquidityProviders.Gmx,
  // LiquidityProviders.TraderJoeV2,
  // LiquidityProviders.ZyberswapV3,
  // LiquidityProviders.UniswapV3,
  // LiquidityProviders.SushiSwap,
  // LiquidityProviders.Curve
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

  const token0 = WNATIVE[ParachainId.MOONBEAM]
  const token1 = USDC[ParachainId.MOONBEAM]

  it.skip(`should fetch pools for ${token0.symbol} and ${token1.symbol}`, async () => {
    DATA_FETCHER.startDataFetching(DEFAULT_PROVIDERS)
    await DATA_FETCHER.fetchPoolsForToken(token0, token1)
    const router = new Router(
      DATA_FETCHER,
      token0,
      BigNumber.from('1000000000000000000'),
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
