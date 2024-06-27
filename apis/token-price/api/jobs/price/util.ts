/* eslint-disable no-console */
import { ParachainId } from '@zenlink-interface/chain'
import { fetchMarketPrices, fetchTokenPrices, fetchUniV3TokenPrices } from '@zenlink-interface/graph-client'
import { getUnixTime } from 'date-fns'
import stringify from 'fast-json-stable-stringify'
import {
  ALL_CHAINS,
  AMM_SUPPORTED_CHAINS,
  LIFI_SUPPORTED_CHAINS,
  MARKET_SUPPORTED_CHAINS,
  UNI_SUPPORTED_CHAINS,
} from '../../../config'
import { fetchTokenPricesFromLifiApi } from '../../../lib/custom-prices'
import redis from '../../../lib/redis'

async function getAMMTokenPriceResults() {
  const results = await Promise.all(
    AMM_SUPPORTED_CHAINS.map(chainId => fetchTokenPrices(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map(({ data }, i) => {
      const nativePrice = Number(data?.bundleById?.ethPrice || 0)
      return {
        chainId: AMM_SUPPORTED_CHAINS[i],
        tokens: data?.tokens.map(token => ({
          id: token.id,
          priceUSD: Number(token.derivedETH) * nativePrice,
          liquidity: Number(token.totalLiquidity),
        })) || [],
      }
    })
}

async function getMarketPricesResults() {
  const results = await Promise.all(
    MARKET_SUPPORTED_CHAINS.map(chainId => fetchMarketPrices(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map(({ data }, i) => {
      return {
        chainId: MARKET_SUPPORTED_CHAINS[i],
        tokens: data?.markets.map(market => ([
          { id: market.id, priceUSD: market.priceUSD },
          { id: market.sy.id, priceUSD: market.sy.priceUSD },
          { id: market.sy.baseAsset.id, priceUSD: market.sy.baseAsset.priceUSD },
          { id: market.sy.yieldToken.id, priceUSD: market.sy.yieldToken.priceUSD },
          { id: market.pt.id, priceUSD: market.pt.priceUSD },
          { id: market.yt.id, priceUSD: market.yt.priceUSD },
        ])).flat() || [],
      }
    })
}

async function getUniTokenPriceResults() {
  const results = await Promise.all(
    UNI_SUPPORTED_CHAINS.map(chainId => fetchUniV3TokenPrices(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map(({ data }, i) => {
      const nativePrice = Number(data?.bundle?.ethPriceUSD || 0)
      return {
        chainId: UNI_SUPPORTED_CHAINS[i],
        tokens: data?.tokens.map(token => ({
          id: token.id,
          priceUSD: Number(token.derivedETH) * nativePrice,
          liquidity: Number(token.totalSupply),
        })) || [],
      }
    })
}

async function getLifiTokenPriceResults() {
  const results = await Promise.all(
    LIFI_SUPPORTED_CHAINS.map(chainId => fetchTokenPricesFromLifiApi(chainId)),
  )
  return results
}

export async function execute() {
  console.log(
    `Updating prices for chains: ${ALL_CHAINS
      .map(chainId => ParachainId[chainId])
      .join(', ')}`,
  )

  const results = (
    await Promise.all([
      getMarketPricesResults(),
      getLifiTokenPriceResults(),
      getAMMTokenPriceResults(),
      getUniTokenPriceResults(),
    ])
  ).flat()
  const chainIds = Array.from(new Set(results.map(result => result.chainId)))
  const combined = chainIds.map((chainId) => {
    const sources = results.filter(result => result.chainId === chainId)
    let tokens: { id: string, priceUSD: number }[] = []
    const uniqueTokens = new Map()
    sources.forEach((source) => {
      source.tokens.forEach(token => uniqueTokens.set(token.id, token.priceUSD))
    })
    tokens = Array.from(uniqueTokens.entries()).map(([id, priceUSD]) => ({ id, priceUSD }))
    return { chainId, updatedAtTimestamp: getUnixTime(Date.now()), tokens }
  })

  await redis.hset(
    'prices',
    Object.fromEntries(
      combined.map(({ chainId, tokens, updatedAtTimestamp }) => [
        chainId,
        stringify({
          chainId,
          ...tokens.reduce((acc, token) => ({ ...acc, [token.id]: token.priceUSD }), {}),
          updatedAtTimestamp,
        }),
      ]),
    ),
  )

  console.log('Finished updating prices')
}
