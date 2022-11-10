import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
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
      pairDayData(orderBy: date_DESC, limit: 7) {
        id
        dailyVolumeUSD
        date
      }
    }
  }
`

export async function fetchPairById(chainId: ParachainId, id: string) {
  let data: PairMeta | null = null
  let error = false

  try {
    const { data: userPoolsData } = await CLIENTS[chainId].query({
      query: PAIR_BY_ID,
      variables: {
        id,
      },
    })
    data = userPoolsData.pairById
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
      pairDayData(orderBy: date_DESC, limit: 7) {
        id
        dailyVolumeUSD
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
        limit,
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
