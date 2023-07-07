import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type {
  PairLiquidityPositionQueryData,
  StableSwapLiquidityPositionQueryData,
  StakePositionQueryData,
} from '../types'
import type {
  UserPoolsQuery,
  UserPoolsQueryVariables,
} from '../__generated__/types-and-hooks'
import {
  PairDayDataOrderByInput,
  StableSwapDayDataOrderByInput,
} from '../__generated__/types-and-hooks'
import { encodeChainAddress } from '../utils'
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
          farm {
            id
            stakeApr
          }
        }
      }
      stakePositions {
        id
        liquidityStakedBalance
        farm {
          id
          pair {
            farm {
              id
              stakeApr
            }
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
          singleTokenLock {
            id
            farm {
              id
              stakeApr
            }
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
          }
          stableSwap {
            id
            lpToken
            address
            lpTotalSupply
            tokens
            balances
            swapFee
            tvlUSD
            farm {
              id
              stakeApr
            }
          }
          stakeApr
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
          farm {
            id
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
            singleTokenLock {
              id
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
            }
            stableSwap {
              id
            }
            stakeApr
          },
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
  pairPositionsLimit: 100,
  pairDayDataOrderBy: PairDayDataOrderByInput.DateDesc,
  pairDayDataLimit: 7,
  stableSwapPositionsWhere: { liquidityTokenBalance_gt: '0' },
  stableSwapPositionsLimit: 100,
  stableSwapDayDataOrderBy: StableSwapDayDataOrderByInput.DateDesc,
  stableSwapDayDataLimit: 7,
}

export async function fetchUserPools(chainId: ParachainId, user: string) {
  const address = encodeChainAddress(user, chainId)
  let data: {
    liquidityPositions: PairLiquidityPositionQueryData[]
    stableSwapLiquidityPositions: StableSwapLiquidityPositionQueryData[]
    stakePositions: StakePositionQueryData[]
  } | null = null
  let error = false

  try {
    const { data: userPoolsData } = await CLIENTS[chainId].query<UserPoolsQuery>({
      query: USER_POOLS_FETCH,
      variables: {
        ...defaultUserPoolsFetcherParams,
        id: address,
      },
    })
    data = userPoolsData.userById ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
