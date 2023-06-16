import { gql } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { SingleTokenLockQueryData } from '../types'
import type {
  SingleTokenLockByIdQuery,
  SingleTokenLockByIdQueryVariables,
  SingleTokenLockOrderByInput,
  SingleTokenLocksQuery,
  SingleTokenLocksQueryVariables,
} from '../__generated__/types-and-hooks'
import {
  SingleTokenLockDayDataOrderByInput,
  SingleTokenLockHourDataOrderByInput,
} from '../__generated__/types-and-hooks'
import { wrapResultData } from '.'

const SINGLE_TOKEN_LOCK_BY_ID = gql`
  query singleTokenLockById(
    $id: String!, 
    $hourDataOrderBy: [SingleTokenLockHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [SingleTokenLockDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
    singleTokenLockById(id: $id) {
      token {
        id
        name
        decimals
        symbol
      }
      id
      totalLiquidity
      totalLiquidityETH
      totalLiquidityUSD
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
      singleTokenLockHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        totalLiquidity
        totalLiquidityUSD
        totalLiquidityETH
        hourStartUnix
      }
      singleTokenLockDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        totalLiquidity
        totalLiquidityUSD
        totalLiquidityETH
        date
      }
    }
  }
`

const defaultPairFetcherParams: Omit<SingleTokenLockByIdQueryVariables, 'id'> = {
  hourDataOrderBy: SingleTokenLockHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 168,
  dayDataOrderBy: SingleTokenLockDayDataOrderByInput.DateDesc,
  dayDataLimit: 750,
}

export async function fetchSingleTokenLockById(chainId: ParachainId, id: string) {
  let data: SingleTokenLockQueryData | null = null
  let error = false

  try {
    const { data: pair } = await CLIENTS[chainId].query<SingleTokenLockByIdQuery>({
      query: SINGLE_TOKEN_LOCK_BY_ID,
      variables: {
        ...defaultPairFetcherParams,
        id,
      },
    })
    data = pair.singleTokenLockById ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}

const SINGLE_TOKEN_LOCKS = gql`
  query singleTokenLocks(
    $limit: Int, 
    $orderBy: [SingleTokenLockOrderByInput!],
    $hourDataOrderBy: [SingleTokenLockHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [SingleTokenLockDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
    singleTokenLocks(limit: $limit, orderBy: $orderBy) {
      token {
        id
        name
        decimals
        symbol
      }
      id
      totalLiquidity
      totalLiquidityETH
      totalLiquidityUSD
      farm {
        id
        pid
        incentives {
          id
          rewardPerDay
          rewardToken {
            symbol
          }
        }
        stakeApr
      }
      singleTokenLockHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        totalLiquidity
        totalLiquidityUSD
        totalLiquidityETH
        hourStartUnix
      }
      singleTokenLockDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        totalLiquidity
        totalLiquidityUSD
        totalLiquidityETH
        date
      }
    }
  }
`

interface SingleTokenLocksFetcherParams {
  chainId: ParachainId
  limit: number
  orderBy: SingleTokenLockOrderByInput
}

const defaultPairsFetcherParams: Omit<SingleTokenLocksQueryVariables, 'limit' | 'orderBy'> = {
  hourDataOrderBy: SingleTokenLockHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 24,
  dayDataOrderBy: SingleTokenLockDayDataOrderByInput.DateDesc,
  dayDataLimit: 7,
}

export async function fetchSingleTokenLocks({
  chainId,
  limit,
  orderBy,
}: SingleTokenLocksFetcherParams) {
  let data: SingleTokenLockQueryData[] | null = null
  let error = false

  try {
    const { data: result } = await CLIENTS[chainId].query<SingleTokenLocksQuery>({
      query: SINGLE_TOKEN_LOCKS,
      variables: {
        ...defaultPairsFetcherParams,
        limit: chainId === ParachainId.CALAMARI_KUSAMA ? 70 : limit,
        orderBy,
      },
    })
    data = result.singleTokenLocks
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
