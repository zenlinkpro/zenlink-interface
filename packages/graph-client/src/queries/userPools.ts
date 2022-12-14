import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type {
  PairLiquidityPositionQueryData,
  StableSwapLiquidityPositionQueryData,
} from '../types'
import type {
  UserPoolsQuery,
  UserPoolsQueryVariables,
} from '../__generated__/types-and-hooks'
import {
  PairDayDataOrderByInput,
  StableSwapDayDataOrderByInput,
} from '../__generated__/types-and-hooks'
import { wrapResultData } from '.'

const USER_POOLS_FETCH = gql`
  query userPools(
    $id: String!,
    $pairPositionsWhere: LiquidityPositionWhereInput,
    $pairPositionsLimit: Int,
    $pairDayDataOrderBy: [PairDayDataOrderByInput!],
    $pairDayDataLimit: Int,
    $stableSwapPositionsWhere: StableSwapLiquidityPositionWhereInput,
    $stableSwapPositionsLimit: Int,
    $stableSwapDayDataOrderBy: [StableSwapDayDataOrderByInput!],
    $stableSwapDayDataLimit: Int,
  ) {
    userById(id: $id) {
      liquidityPositions(
        where: $pairPositionsWhere, 
        limit: $pairPositionsLimit
      ) {
        id
        liquidityTokenBalance
        pair {
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
          pairDayData(
            orderBy: $pairDayDataOrderBy, 
            limit: $pairDayDataLimit
          ) {
            id
            dailyVolumeUSD
            reserveUSD
            date
          }
        }
      }
      stableSwapLiquidityPositions(
        where: $stableSwapPositionsWhere, 
        limit: $stableSwapPositionsLimit
      ) {
        id
        liquidityTokenBalance
        stableSwap {
          id
          lpToken
          address
          lpTotalSupply
          tokens
          balances
          swapFee
          tvlUSD
          stableSwapDayData(
            orderBy: $stableSwapDayDataOrderBy, 
            limit: $stableSwapDayDataLimit
          ) {
            id
            tvlUSD
            dailyVolumeUSD
            date
          }
        }
      }
    }
  }
`

const defaultUserPoolsFetcherParams: Omit<UserPoolsQueryVariables, 'id'> = {
  pairPositionsWhere: { liquidityTokenBalance_gt: '0' },
  pairPositionsLimit: 10,
  pairDayDataOrderBy: PairDayDataOrderByInput.DateDesc,
  pairDayDataLimit: 7,
  stableSwapPositionsWhere: { liquidityTokenBalance_gt: '0' },
  stableSwapPositionsLimit: 10,
  stableSwapDayDataOrderBy: StableSwapDayDataOrderByInput.DateDesc,
  stableSwapDayDataLimit: 7,
}

export async function fetchUserPools(chainId: ParachainId, user: string) {
  let data: {
    liquidityPositions: PairLiquidityPositionQueryData[]
    stableSwapLiquidityPositions: StableSwapLiquidityPositionQueryData[]
  } | null = null
  let error = false

  try {
    const { data: userPoolsData } = await CLIENTS[chainId].query<UserPoolsQuery>({
      query: USER_POOLS_FETCH,
      variables: {
        ...defaultUserPoolsFetcherParams,
        id: user,
      },
    })
    data = userPoolsData.userById ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
