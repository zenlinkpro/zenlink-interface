/* eslint-disable no-console */
import stringify from 'fast-json-stable-stringify'
import { ParachainId } from '@zenlink-interface/chain'
import { getUnixTime } from 'date-fns'
import { fetchTokenPrices } from '@zenlink-interface/graph-client'
import redis from '../../lib/redis'
import { ZENLINK_CHAINS } from './config'

async function getTokenPriceResults() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchTokenPrices(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map(({ data }, i) => {
      const nativePrice = Number(data?.bundleById?.ethPrice || 0)
      return {
        chainId: ZENLINK_CHAINS[i],
        tokens: data?.tokens.map(token => ({
          id: token.id,
          priceUSD: Number(token.derivedETH) * nativePrice,
          liquidity: Number(token.totalLiquidity),
        })) || [],
      }
    })
}

export async function execute() {
  console.log(
    `Updating prices for chains: ${ZENLINK_CHAINS
      .map(chainId => ParachainId[chainId])
      .join(', ')}`,
  )

  const results = await getTokenPriceResults()
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
  // process.exit()
}
