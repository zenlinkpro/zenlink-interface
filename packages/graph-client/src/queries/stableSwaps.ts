import { gql } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { StableSwapQueryData } from '../types'
import type { StableSwapByIdQuery, StableSwapsQuery } from '../__generated__/types-and-hooks'
import { wrapResultData } from '.'

const STABLESWAP_BY_ID = gql`
  query stableSwapById($id: String!) {
    stableSwapById(id: $id) {
      id
      address
      lpToken
      lpTotalSupply
      tokens
      balances
      swapFee
      tvlUSD
      stableSwapHourData(orderBy: hourStartUnix_DESC, limit: 168) {
        id
        hourStartUnix
        hourlyVolumeUSD
        tvlUSD
      }
      stableSwapDayData(orderBy: date_DESC, limit: 750) {
        id
        tvlUSD
        dailyVolumeUSD
        date
      }
    }
  }
`

export async function fetchStableSwapById(chainId: ParachainId, id: string) {
  let data: StableSwapQueryData | null = null
  let error = false

  try {
    const { data: stableSwap } = await CLIENTS[chainId].query<StableSwapByIdQuery>({
      query: STABLESWAP_BY_ID,
      variables: {
        id,
      },
    })
    data = stableSwap.stableSwapById ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}

const STABLESWAPS = gql`
  query stableSwaps($limit: Int, $orderBy: [StableSwapOrderByInput!]) {
    stableSwaps(limit: $limit, orderBy: $orderBy) {
      id
      address
      lpToken
      lpTotalSupply
      tokens
      balances
      swapFee
      tvlUSD
      stableSwapHourData(orderBy: hourStartUnix_DESC, limit: 24) {
        id
        hourStartUnix
        hourlyVolumeUSD
        tvlUSD
      }
      stableSwapDayData(orderBy: date_DESC, limit: 7) {
        id
        tvlUSD
        dailyVolumeUSD
        date
      }
    }
  }
`

export async function fetchStableSwaps({
  chainId,
  limit,
  orderBy,
}: { chainId: ParachainId; limit: number; orderBy: string }) {
  let data: StableSwapQueryData[] | null = null
  let error = false

  try {
    const { data: stableSwaps } = await CLIENTS[chainId].query<StableSwapsQuery>({
      query: STABLESWAPS,
      variables: {
        limit: chainId === ParachainId.BIFROST_KUSAMA ? 70 : limit,
        orderBy,
      },
    })
    data = stableSwaps.stableSwaps
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}

