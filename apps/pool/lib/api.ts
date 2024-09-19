import type { Pool, StableSwap } from '@zenlink-interface/graph-client'
import {
  liquidityPositions,
  pairById,
  pairsByChainIds,
  singleTokenLockById,
  singleTokenLocksByChainIds,
  stableSwapById,
  stableSwapsByChainIds,
} from '@zenlink-interface/graph-client'
import { isPoolEnabledFarms } from '@zenlink-interface/shared'
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

export async function getUser(query: GetUserQuery) {
  try {
    const networks = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
    let positions = await liquidityPositions(networks, query.id)
    const where = query?.where ? JSON.parse(query.where) : null
    if (where?.type_in?.length)
      positions = positions.filter(position => where.type_in.includes(position.type))
    if (where?.name_contains_nocase)
      positions = positions.filter(position => position.pool.name.toLowerCase().includes(where.name_contains_nocase.toLowerCase()))
    return positions
  }
  catch {
    return []
  }
}

export type GetPoolCountQuery = Partial<{
  networks: string
}>

export async function getPoolCount(query?: GetPoolCountQuery) {
  try {
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    return (await Promise.all([
      pairsByChainIds({ chainIds }),
      stableSwapsByChainIds({ chainIds }),
      singleTokenLocksByChainIds({ chainIds }),
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

const ORDER_KEY_MAP: Record<string, keyof Pool> = {
  liquidityUSD: 'reserveUSD',
  volume: 'volume1d',
  fees: 'fees1d',
  apr: 'apr',
}

export async function getPools(query?: GetPoolsQuery): Promise<Pool[]> {
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
    const orderBy = ORDER_KEY_MAP[(query?.orderBy || 'liquidityUSD')] || 'reserveUSD'
    const orderDirection = query?.orderDirection || 'desc'
    let pools = (await Promise.all([
      pairsByChainIds({ chainIds }),
      stableSwapsByChainIds({ chainIds }),
      singleTokenLocksByChainIds({ chainIds }),
    ])).flat()
    const where = query?.where ? JSON.parse(query.where) : null
    pools = where?.farms_only ? pools.filter(p => isPoolEnabledFarms(p)) : pools
    if (where?.type_in?.length)
      pools = pools.filter(pool => where.type_in.includes(pool.type))
    if (where?.name_contains_nocase)
      pools = pools.filter(pool => pool.name.toLowerCase().includes(where.name_contains_nocase.toLowerCase()))
    return pools
      .sort((a, b) => {
        if (orderDirection === 'asc')
          return Number(a[orderBy]) - Number(b[orderBy])
        else if (orderDirection === 'desc')
          return Number(b[orderBy]) - Number(a[orderBy])

        return 0
      })
      .slice(fromIndex, toIndex)
  }
  catch (err) {
    return []
  }
}

export async function getStablePools(query?: GetPoolsQuery): Promise<StableSwap[]> {
  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
  const pools = await stableSwapsByChainIds({ chainIds })
  return pools
}

export async function getPool(id: string): Promise<Pool | undefined> {
  if (!id.includes(':'))
    throw new Error('Invalid pair id')
  const [pair, stableSwap, singleTokenLock] = await Promise.all([
    pairById(id),
    stableSwapById(id),
    singleTokenLockById(id),
  ])
  return (pair || stableSwap || singleTokenLock) as Pool
}
