import { ParachainId } from "@zenlink-interface/chain"
import { Native, USDC } from "@zenlink-interface/currency"
import { providers } from "ethers"
import { afterAll, beforeAll, expect, describe, it } from "vitest"
import { DataFetcher } from "../fetchers"
import { LiquidityProviders, NativeWrapProvider, ZenlinkProvider } from "../liquidity-providers"

const chainDataProvider = new providers.JsonRpcProvider('https://astar.api.onfinality.io/public', 592)
const DATA_FETCHER = new DataFetcher(chainDataProvider, ParachainId.ASTAR)
const DEFAULT_PROVIDERS = [LiquidityProviders.Zenlink, LiquidityProviders.Sirius]

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
    expect(providers[1]).toBeInstanceOf(ZenlinkProvider)
  })

  it('should have the default state', async () => {
    expect(DATA_FETCHER.getCurrentPoolStateId(DEFAULT_PROVIDERS)).toBe(0)
  })

  const token0 = Native.onChain(ParachainId.ASTAR)
  const token1 = USDC[ParachainId.ASTAR]

  it.skip(`should fetch pools for ${token0.symbol} and ${token1.symbol}`, async () => {
    DATA_FETCHER.fetchPoolsForToken(token0, token1)
    await new Promise((r) => setTimeout(r, 4500))
    const pools = DATA_FETCHER.getCurrentPoolCodeMap()
    // expect(pools.size).toBeGreaterThan(3)
  })

  it.skip('should have a block', async () => {
    const blockNumber = DATA_FETCHER.getLastUpdateBlock()
    await new Promise((r) => setTimeout(r, 500))
    expect(blockNumber).toBeGreaterThan(0)
    expect(blockNumber).not.toBeUndefined
  })
})
