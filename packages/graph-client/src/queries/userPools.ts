import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'

const USER_POOLS_FETCH = gql`
  query userPools($id: String!) {
    userById(id: $id) {
      liquidityPositions {
        id
        liquidityTokenBalance
        pair {
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          id
          totalSupply
          reserveUSD
        }
      }
    }
  }
`

export interface LiquidityPositionMeta {
  id: string
  liquidityTokenBalance: string
  pair: {
    id: string
    token0: {
      symbol: string
    }
    token1: {
      symbol: string
    }
    totalSupply: string
    reserveUSD: string
  }
}

export interface UserPools {
  userById: {
    liquidityPositions: LiquidityPositionMeta[]
  }
}

export async function fetchUserPools(chainId: ParachainId, user: string) {
  let data: UserPools['userById'] | null = null
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
