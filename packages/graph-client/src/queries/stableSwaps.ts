import { gql } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { LEGACY_CLIENTS } from '../appolo'
import type { StableSwapQueryData } from '../types'
import type {
  StableSwapByIdQuery,
  StableSwapByIdQueryVariables,
  StableSwapOrderByInput,
  StableSwapsQuery,
  StableSwapsQueryVariables,
} from '../__generated__/types-and-hooks'
import {
  StableSwapDayDataOrderByInput,
  StableSwapHourDataOrderByInput,
} from '../__generated__/types-and-hooks'
import { wrapResultData } from '.'

const STABLESWAP_BY_ID = gql`
  query stableSwapById(
    $id: String!,
    $hourDataOrderBy: [StableSwapHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [StableSwapDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
    stableSwapById(id: $id) {
      id
      address
      lpToken
      lpTotalSupply
      tokens
      balances
      swapFee
      tvlUSD
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
      stableSwapHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        hourStartUnix
        hourlyVolumeUSD
        tvlUSD
      }
      stableSwapDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        tvlUSD
        dailyVolumeUSD
        date
      }
    }
  }
`

const defaultStableSwapFetcherParams: Omit<StableSwapByIdQueryVariables, 'id'> = {
  hourDataOrderBy: StableSwapHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 168,
  dayDataOrderBy: StableSwapDayDataOrderByInput.DateDesc,
  dayDataLimit: 750,
}

export async function fetchStableSwapById(chainId: ParachainId, id: string) {
  let data: StableSwapQueryData | null = null
  let error = false

  try {
    const { data: stableSwap } = await LEGACY_CLIENTS[chainId].query<StableSwapByIdQuery>({
      query: STABLESWAP_BY_ID,
      variables: {
        ...defaultStableSwapFetcherParams,
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
  query stableSwaps(
    $limit: Int, 
    $orderBy: [StableSwapOrderByInput!],
    $hourDataOrderBy: [StableSwapHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [StableSwapDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
    stableSwaps(limit: $limit, orderBy: $orderBy) {
      id
      address
      lpToken
      lpTotalSupply
      tokens
      balances
      swapFee
      tvlUSD
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
      stableSwapHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        hourStartUnix
        hourlyVolumeUSD
        tvlUSD
      }
      stableSwapDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        tvlUSD
        dailyVolumeUSD
        date
      }
    }
  }
`

interface StableSwapsFetcherParams {
  chainId: ParachainId
  limit: number
  orderBy: StableSwapOrderByInput
}

const defaultStableSwapsFetcherParams: Omit<StableSwapsQueryVariables, 'limit' | 'orderBy'> = {
  hourDataOrderBy: StableSwapHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 24,
  dayDataOrderBy: StableSwapDayDataOrderByInput.DateDesc,
  dayDataLimit: 7,
}

export async function fetchStableSwaps({
  chainId,
  limit,
  orderBy,
}: StableSwapsFetcherParams) {
  let data: StableSwapQueryData[] | null = null
  let error = false

  try {
    const { data: stableSwaps } = await LEGACY_CLIENTS[chainId].query<StableSwapsQuery>({
      query: STABLESWAPS,
      variables: {
        ...defaultStableSwapsFetcherParams,
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
