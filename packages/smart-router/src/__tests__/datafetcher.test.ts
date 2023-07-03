import { ParachainId } from "@zenlink-interface/chain"
import { USDC, WETH9, WNATIVE, ZLK } from "@zenlink-interface/currency"
import { afterAll, beforeAll, expect, describe, it } from "vitest"
import { DataFetcher } from "../fetchers"
import {LiquidityProviders, NativeWrapProvider } from "../liquidity-providers"
import { Chain, createPublicClient, encodeAbiParameters, hexToString, http, parseAbiParameters, stringToBytes, stringToHex } from "viem"
import { arbitrum, moonbeam } from "@zenlink-interface/wagmi-config"
import { Router } from "../routers"
import { BigNumber } from "@ethersproject/bignumber"
import { HEXer } from "../HEXer"
import { concat, formatBytes32String, hexlify, toUtf8Bytes } from "ethers/lib/utils"

const DATA_FETCHER = new DataFetcher(
  ParachainId.MOONBEAM,
  createPublicClient({
    chain: moonbeam as Chain,
    transport: http(moonbeam.rpcUrls.default.http[0]),
  })
)
const DEFAULT_PROVIDERS = [
  LiquidityProviders.Zenlink, 
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
  const token1 = ZLK[ParachainId.MOONBEAM]

  it(`should fetch pools for ${token0.symbol} and ${token1.symbol}`, async () => {
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
    if (bestRoute) {
      console.log(Router.aggregationRouterParams(
        DATA_FETCHER,
        bestRoute,
        token0,
        token1,
        '0x1c74A73ec0Dda983F643925E7c3E7D1965fbe920',
        '0xB74B05CAF4c91cd23c2Aa2e13a3463eeBdB79Bda',
        '0xEE1A54332492d54394E747988DBaECfbF1d49795',
        '0x48EbBFD5cDF230389e47ad5a0CBCA353C542dcC6',
      ))
    }
    
    console.log(bestRoute)
  })

  it('log route', () => {
    const route = new HEXer()
      .address('0x2e234DAe75C793f67A35089C9d99245E1C58470b')
      .uint8(1)
      .share16(1)
      .uint8(2)
      .hexData(
        new HEXer()
          .address('0x03A6a84cD762D9707A21605b548aaaB891562aAb')
          .bytes(
            encodeAbiParameters(
              parseAbiParameters('address, address'),
              ['0xF62849F9A0B5Bf2913b396098F7c7019b51A820a', '0x1d1499e622D69689cdf9004d05Ec547d650Ff211']
            ),
          )
          .toString()
      )
      
      console.log('string', `0x${route.toString()}`)
  })

  it.skip('should have a block', async () => {
    const blockNumber = DATA_FETCHER.getLastUpdateBlock()
    await new Promise((r) => setTimeout(r, 500))
    expect(blockNumber).toBeGreaterThan(0)
    expect(blockNumber).not.toBeUndefined
  })
})
