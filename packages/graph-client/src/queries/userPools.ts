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
    }
  }
`

export interface LiquidityPositionMeta {
  id: string
  liquidityTokenBalance: string
  pair: {
    id: string
    token0: {
      id: string
      name: string
      decimals: number
      symbol: string
    }
    token1: {
      id: string
      name: string
      decimals: number
      symbol: string
    }
    totalSupply: string
    reserve0: string
    reserve1: string
    reserveUSD: string
    pairDayData: {
      id: string
      dailyVolumeUSD: string
      date: string
    }[]
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
