import type { Pool, StableSwap } from '@zenlink-interface/graph-client'
import {
  liquidityPositions,
  pairById,
  pairsByChainIds,
  stableSwapById,
  stableSwapsByChainIds,
} from '@zenlink-interface/graph-client'
import { SUPPORTED_CHAIN_IDS } from 'config'
import stringify from 'fast-json-stable-stringify'

export interface Pagination {
  pageIndex: number
  pageSize: number
}

export interface GetUserQuery {
  id: string
  networks: string
  where?: string
}

export const getUser = async (query: GetUserQuery) => {
  const networks = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
  let positions = await liquidityPositions(networks, query.id)
  const where = query?.where ? JSON.parse(query.where) : null
  if (where?.type_in?.length)
    positions = positions.filter(position => where.type_in.includes(position.type))
  if (where?.name_contains_nocase)
    positions = positions.filter(position => position.pool.name.toLowerCase().includes(where.name_contains_nocase.toLowerCase()))
  return positions
}

export type GetPoolCountQuery = Partial<{
  networks: string
}>

export const getPoolCount = async (query?: GetPoolCountQuery) => {
  try {
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    return (await Promise.all([
      pairsByChainIds({ chainIds }),
      stableSwapsByChainIds({ chainIds }),
    ])).flat().length
  }
  catch {
    return 0
  }
}

export interface GetPoolsQuery {
  networks: string
  where?: string
  pagination: string
  orderBy: string
  orderDirection: string
}

export const getPools = async (query?: GetPoolsQuery): Promise<Pool[]> => {
  try {
    const chainIds = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
    const pagination: Pagination = query?.pagination
      ? JSON.parse(query.pagination)
      : {
          pageIndex: 0,
          pageSize: 20,
        }
    const fromIndex = pagination.pageIndex * pagination.pageSize
    const toIndex = (pagination.pageIndex + 1) * pagination.pageSize
    const orderDirection = query?.orderDirection || 'desc'
    let pools = (await Promise.all([
      pairsByChainIds({ chainIds }),
      stableSwapsByChainIds({ chainIds }),
    ])).flat()
    const where = query?.where ? JSON.parse(query.where) : null
    if (where?.type_in?.length)
      pools = pools.filter(pool => where.type_in.includes(pool.type))
    if (where?.name_contains_nocase)
      pools = pools.filter(pool => pool.name.toLowerCase().includes(where.name_contains_nocase.toLowerCase()))
    return pools
      .sort((a, b) => {
        if (orderDirection === 'asc')
          return Number(a.reserveUSD) - Number(b.reserveUSD)
        else if (orderDirection === 'desc')
          return Number(b.reserveUSD) - Number(a.reserveUSD)

        return 0
      })
      .slice(fromIndex, toIndex)
  }
  catch (err) {
    return []
  }
}

export const getStablePools = async (query?: GetPoolsQuery): Promise<StableSwap[]> => {
  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
  const pools = await stableSwapsByChainIds({ chainIds })
  return pools
}

export const getPool = async (id: string): Promise<Pool | undefined> => {
  if (!id.includes(':'))
    throw new Error('Invalid pair id')
  const [pair, stableSwap] = await Promise.all([
    pairById(id),
    stableSwapById(id),
  ])
  return pair || stableSwap
}
