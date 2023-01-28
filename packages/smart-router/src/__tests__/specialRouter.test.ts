import { ParachainId } from "@zenlink-interface/chain"
import { USDC, WNATIVE } from "@zenlink-interface/currency"
import { BigNumber, providers } from "ethers"
import { afterAll, beforeAll, expect, describe, it } from "vitest"
import { DataFetcher } from "../fetchers"
import { findSpecialRoute } from "../routers"

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
  const token0 = WNATIVE[ParachainId.ASTAR]
  const token1 = USDC[ParachainId.ASTAR]
  
  it.skip('swap case 1', async () => {
    DATA_FETCHER.fetchPoolsForToken(token0, token1)
    await new Promise((r) => setTimeout(r, 3000))

    console.log(BigNumber.from(10).pow(22).toString())

    const bestRoute = findSpecialRoute(
      DATA_FETCHER,
      token0,
      BigNumber.from(10).pow(23),
      token1,
      30e9
    )
  })
})
