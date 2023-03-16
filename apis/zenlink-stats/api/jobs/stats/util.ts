/* eslint-disable no-console */
import stringify from 'fast-json-stable-stringify'
import { ParachainId } from '@zenlink-interface/chain'
import { getUnixTime } from 'date-fns'
import { fetchZenlinkStats } from '@zenlink-interface/graph-client'
import axios from 'axios'
import redis from '../../../lib/redis'
import { SUBSCAN_API_KEY, ZENLINK_CHAINS } from './config'
import { fetchEvmZLKHoldersBySubScan } from './holders'
import { getZLKDistributeAndBurn } from './distribute'

async function fetchBifrostKusamaZLKHolders() {
  const assetData = await axios.post('https://bifrost-kusama.api.subscan.io/api/v2/scan/tokens', {
    provider: 'asset_registry',
    include_extends: true,
    row: 100,
    page: 0,
  }, {
    headers: {
      'X-API-Key': SUBSCAN_API_KEY,
    },
  })

  const zlkAssetData = assetData.data.data.tokens.find((item: any) => {
    return item.currency_id === 'ZLK'
  })

  const holders = zlkAssetData.extends.holders
  return holders
}

async function fetchZLKHolders(chainId: ParachainId) {
  if (chainId === ParachainId.BIFROST_KUSAMA)
    return await fetchBifrostKusamaZLKHolders()
  if (
    chainId === ParachainId.MOONBEAM
    || chainId === ParachainId.MOONRIVER
    || chainId === ParachainId.ASTAR
  )
    return await fetchEvmZLKHoldersBySubScan(chainId)
  return 0
}

async function getZLKHolders() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchZLKHolders(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map((holders, i) => {
      return {
        chainId: ZENLINK_CHAINS[i],
        holders,
      }
    })
}

async function getZenlinkStatsResults() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchZenlinkStats(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map(({ data }, i) => {
      return {
        chainId: ZENLINK_CHAINS[i],
        zenlinkStats: data,
      }
    })
}

export async function execute() {
  console.log(
    `Updating zenlink stats for chains: ${ZENLINK_CHAINS
      .map(chainId => ParachainId[chainId])
      .join(', ')}`,
  )

  const results = await getZenlinkStatsResults()
  const holders = await getZLKHolders()
  const chainIds = Array.from(new Set(results.map(result => result.chainId)))
  const zlkDistributeResults = await getZLKDistributeAndBurn()
  const combined = chainIds.map((chainId) => {
    const sources = results.filter(result => result.chainId === chainId)

    const distributeAndBurn = zlkDistributeResults.find(item => item.chainId === chainId)?.result
    const zenlinkStats = sources[0].zenlinkStats?.zenlinkInfoById
    const holder = holders.find(item => item.chainId === chainId)?.holders ?? 0
    const totalDistribute = distributeAndBurn?.totalDistribute ?? 0
    const totalBurn = distributeAndBurn?.burn ?? 0
    const zenlinkInfo = {
      totalTvlUSD: zenlinkStats?.totalTvlUSD,
      totalVolumeUSD: zenlinkStats?.totalVolumeUSD,
      holders: holder,
      totalDistribute,
      totalBurn,
    }
    return { chainId, updatedAtTimestamp: getUnixTime(Date.now()), zenlinkInfo }
  })

  const zlkStats = Object.fromEntries(
    combined.map(({ chainId, zenlinkInfo, updatedAtTimestamp }) => [
      chainId,
      stringify({
        chainId,
        zenlinkInfo,
        updatedAtTimestamp,
      }),
    ]),
  )

  await redis.hset(
    'zlk-stats',
    zlkStats,
  )
  console.log('Finished updating zlk stats')
}
