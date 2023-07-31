/* eslint-disable no-console */
import stringify from 'fast-json-stable-stringify'
import { ParachainId } from '@zenlink-interface/chain'
import { getUnixTime } from 'date-fns'
import { fetchTokenPrices, fetchUniV3TokenPrices } from '@zenlink-interface/graph-client'
import redis from '../../../lib/redis'
import { ALL_CHAINS, AMM_SUPPORTED_CHAINS, UNI_SUPPORTED_CHAINS } from '../../../config'

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

export async function execute() {
  console.log(
    `Updating prices for chains: ${ALL_CHAINS
      .map(chainId => ParachainId[chainId])
      .join(', ')}`,
  )

  const results = (
    await Promise.all([getAMMTokenPriceResults(), getUniTokenPriceResults()])
  ).flat()
  const chainIds = Array.from(new Set(results.map(result => result.chainId)))
  const combined = chainIds.map((chainId) => {
    const sources = results.filter(result => result.chainId === chainId)
    let tokens: { id: string; priceUSD: number }[] = []
    const uniqueTokens = new Map()
    sources[0].tokens.forEach(token => uniqueTokens.set(token.id, token.priceUSD))
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
