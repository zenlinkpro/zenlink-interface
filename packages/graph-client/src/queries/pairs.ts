import { gql } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { PairQueryData } from '../types'
import type {
  PairByIdQuery,
  PairByIdQueryVariables,
  PairOrderByInput,
  PairsQuery,
  PairsQueryVariables,
} from '../__generated__/types-and-hooks'
import {
  PairDayDataOrderByInput,
  PairHourDataOrderByInput,
} from '../__generated__/types-and-hooks'
import { wrapResultData } from '.'

const PAIR_BY_ID = gql`
  query pairById(
    $id: String!, 
    $hourDataOrderBy: [PairHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [PairDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
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
      farm {
        id
        pid
        incentives {
          id
          rewardPerDay
          rewardToken {
            id
            name
            decimals
            symbol
          }
        }
        stakeApr
      }
      pairHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        hourlyVolumeUSD
        reserveUSD
        hourStartUnix
      }
      pairDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        dailyVolumeUSD
        reserveUSD
        date
      }
    }
  }
`

const defaultPairFetcherParams: Omit<PairByIdQueryVariables, 'id'> = {
  hourDataOrderBy: PairHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 168,
  dayDataOrderBy: PairDayDataOrderByInput.DateDesc,
  dayDataLimit: 750,
}

export async function fetchPairById(chainId: ParachainId, id: string) {
  let data: PairQueryData | null = null
  let error = false

  try {
    const { data: pair } = await CLIENTS[chainId].query<PairByIdQuery>({
      query: PAIR_BY_ID,
      variables: {
        ...defaultPairFetcherParams,
        id,
      },
    })
    data = pair.pairById ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}

const PAIRS = gql`
  query pairs(
    $limit: Int, 
    $orderBy: [PairOrderByInput!],
    $hourDataOrderBy: [PairHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [PairDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
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
      farm {
        id
        pid
        incentives {
          id
          rewardPerDay
          rewardToken {
            id
            name
            decimals
            symbol
          }
        }
        stakeApr
      }
      pairHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        hourlyVolumeUSD
        reserveUSD
        hourStartUnix
      }
      pairDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        dailyVolumeUSD
        reserveUSD
        date
      }
    }
  }
`

interface PairsFetcherParams {
  chainId: ParachainId
  limit: number
  orderBy: PairOrderByInput
}

const defaultPairsFetcherParams: Omit<PairsQueryVariables, 'limit' | 'orderBy'> = {
  hourDataOrderBy: PairHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 24,
  dayDataOrderBy: PairDayDataOrderByInput.DateDesc,
  dayDataLimit: 7,
}

export async function fetchPairs({
  chainId,
  limit,
  orderBy,
}: PairsFetcherParams) {
  let data: PairQueryData[] | null = null
  let error = false

  try {
    const { data: pairs } = await CLIENTS[chainId].query<PairsQuery>({
      query: PAIRS,
      variables: {
        ...defaultPairsFetcherParams,
        limit: chainId === ParachainId.CALAMARI_KUSAMA ? 70 : limit,
        orderBy,
      },
    })
    data = pairs.pairs
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
