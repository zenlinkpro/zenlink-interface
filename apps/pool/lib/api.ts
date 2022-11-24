import type { Pool, StableSwap } from '@zenlink-interface/graph-client'
import { SUPPORTED_CHAIN_IDS } from 'config'
import stringify from 'fast-json-stable-stringify'
import {
  liquidityPositions,
  pairById,
  pairsByChainIds,
  stableSwapById,
  stableSwapsByChainIds,
} from '@zenlink-interface/graph-client'

export interface GetUserQuery {
  id: string
  networks: string
}

export const getUser = async (query: GetUserQuery) => {
  const networks = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
  const positions = await liquidityPositions(networks, query.id.toLowerCase())
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
