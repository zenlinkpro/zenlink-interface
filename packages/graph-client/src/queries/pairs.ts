import { gql } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { PairMeta } from '../types'

const PAIR_BY_ID = gql`
  query pairs($id: String!) {
    pairById(id: $id) {
      token0 {
        id
        name
        decimals
        symbol
      }
      token1 {
        id
        name
        decimals
        symbol
      }
      id
      totalSupply
      reserve0
      reserve1
      reserveUSD
      pairHourData(orderBy: hourStartUnix_DESC, limit: 168) {
        id
        hourlyVolumeUSD
        reserveUSD
        hourStartUnix
      }
      pairDayData(orderBy: date_DESC, limit: 750) {
        id
        dailyVolumeUSD
        reserveUSD
        date
      }
    }
  }
`

export async function fetchPairById(chainId: ParachainId, id: string) {
  let data: PairMeta | null = null
  let error = false

  try {
    const { data: pair } = await CLIENTS[chainId].query({
      query: PAIR_BY_ID,
      variables: {
        id,
      },
    })
    data = pair.pairById
  }
  catch {
    error = true
  }

  if (data) {
    return {
      data,
      error: false,
    }
  }
  else {
    return {
      data: undefined,
      error,
    }
  }
}

const PAIRS = gql`
  query pairs($limit: Int, $orderBy: [PairOrderByInput!]) {
    pairs(limit: $limit, orderBy: $orderBy) {
      token0 {
        id
        name
        decimals
        symbol
      }
      token1 {
        id
        name
        decimals
        symbol
      }
      id
      totalSupply
      reserve0
      reserve1
      reserveUSD
      pairHourData(orderBy: hourStartUnix_DESC, limit: 24) {
        id
        hourlyVolumeUSD
        reserveUSD
        hourStartUnix
      }
      pairDayData(orderBy: date_DESC, limit: 7) {
        id
        dailyVolumeUSD
        reserveUSD
        date
      }
    }
  }
`

export async function fetchPairs({
  chainId,
  limit,
  orderBy,
}: { chainId: ParachainId; limit: number; orderBy: string }) {
  let data: PairMeta[] | null = null
  let error = false

  try {
    const { data: pairs } = await CLIENTS[chainId].query({
      query: PAIRS,
      variables: {
        limit: chainId === ParachainId.BIFROST_KUSAMA ? 70 : limit,
        orderBy,
      },
    })
    data = pairs.pairs
  }
  catch {
    error = true
  }

  if (data) {
    return {
      data,
      error: false,
    }
  }
  else {
    return {
      data: undefined,
      error,
    }
  }
}
