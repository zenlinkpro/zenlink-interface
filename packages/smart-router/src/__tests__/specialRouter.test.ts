import { ParachainId } from "@zenlink-interface/chain"
import { Native, USDC } from "@zenlink-interface/currency"
import { BigNumber, providers } from "ethers"
import { afterAll, beforeAll, expect, describe, it } from "vitest"
import { DataFetcher } from "../fetchers"
import { findSpecialRoute, Router } from "../routers"

const chainDataProvider = new providers.JsonRpcProvider('https://astar.api.onfinality.io/public', 592)
const DATA_FETCHER = new DataFetcher(chainDataProvider, ParachainId.ASTAR)

beforeAll(() => {
  expect(DATA_FETCHER).toBeInstanceOf(DataFetcher)
  DATA_FETCHER.startDataFetching()
})

afterAll(() => {
  DATA_FETCHER.stopDataFetching()
})

describe('DataFetcher', () => {
  const token0 = Native.onChain(ParachainId.ASTAR)
  const token1 = USDC[ParachainId.ASTAR]
  
  it.skip('swap case 1', async () => {
    DATA_FETCHER.fetchPoolsForToken(token0, token1)
    await new Promise((r) => setTimeout(r, 4200))

    const bestRoute = findSpecialRoute(
      DATA_FETCHER,
      token0,
      BigNumber.from(10).pow(23),
      token1,
      30e9
    )

    const routeHumanString = Router.routeToHumanString(
      DATA_FETCHER,
      bestRoute,
      token0,
      token1
    )
    console.log(routeHumanString)
  })
})
