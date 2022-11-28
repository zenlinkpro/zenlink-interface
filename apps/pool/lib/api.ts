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

export interface GetUserQuery {
  id: string
  networks: string
  where?: string
}

export const getUser = async (query: GetUserQuery) => {
  const networks = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
  let positions = await liquidityPositions(networks, query.id.toLowerCase())
  const where = query?.where ? JSON.parse(query.where) : null
  if (where?.type_in?.length)
    positions = positions.filter(position => where.type_in.includes(position.type))
  if (where?.name_contains_nocase)
    positions = positions.filter(position => position.pool.name.toLowerCase().includes(where.name_contains_nocase.toLowerCase()))

  return positions
}

export interface GetPoolsQuery {
  networks: string
  limit?: number
  orderBy?: string
}

export const getPools = async (query?: GetPoolsQuery): Promise<Pool[]> => {
  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
  const pools = await Promise.all([
    pairsByChainIds({ chainIds }),
    stableSwapsByChainIds({ chainIds }),
  ])
  return pools.flat()
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
