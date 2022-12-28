import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { LiquidityPositionMeta, StableSwapLiquidityPositionMeta } from '../types'

const USER_POOLS_FETCH = gql`
  query userPools($id: String!) {
    userById(id: $id) {
      liquidityPositions(where: { liquidityTokenBalance_gt: "0" }, limit: 100) {
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
          pairDayData(orderBy: date_DESC, limit: 7) {
            id
            dailyVolumeUSD
            reserveUSD
            date
          }
        }
      }
      stableSwapLiquidityPositions(where: { liquidityTokenBalance_gt: "0" }, limit: 100) {
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
          stableSwapDayData(orderBy: date_DESC, limit: 7) {
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

export async function fetchUserPools(chainId: ParachainId, user: string) {
  let data: {
    liquidityPositions: LiquidityPositionMeta[]
    stableSwapLiquidityPositions: StableSwapLiquidityPositionMeta[]
  } | null = null
  let error = false

  try {
    const { data: userPoolsData } = await CLIENTS[chainId].query({
      query: USER_POOLS_FETCH,
      variables: {
        id: user,
      },
    })
    data = userPoolsData.userById
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
