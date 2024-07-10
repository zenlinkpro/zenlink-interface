import { ParachainId } from '@zenlink-interface/chain'
import type { DaySnapshot, Pool } from '@zenlink-interface/graph-client'
import {
  daySnapshotsByChainIds,
  marketDaySnapshotsByChainIds,
  pairsByChainIds,
  singleTokenLocksByChainIds,
  stableSwapsByChainIds,
} from '@zenlink-interface/graph-client'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { fromUnixTime, getUnixTime } from 'date-fns'
import stringify from 'fast-json-stable-stringify'

export interface Pagination {
  pageIndex: number
  pageSize: number
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
  volume24h: 'volume1d',
  volume7d: 'volume7d',
  fees24h: 'fees1d',
  fees7d: 'fees7d',
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
    const orderDirection = query?.orderDirection || 'desc'
    const orderBy = ORDER_KEY_MAP[(query?.orderBy || 'liquidityUSD')] || 'reserveUSD'
    let pools = (await Promise.all([
      pairsByChainIds({ chainIds }),
      stableSwapsByChainIds({ chainIds }),
      singleTokenLocksByChainIds({ chainIds }),
    ])).flat()
    const where = query?.where ? JSON.parse(query.where) : null
    if (where?.type_in?.length)
      pools = pools.filter(pool => where.type_in.includes(pool.type))
    if (where?.name_contains_nocase)
      pools = pools.filter(pool => pool.name.toLowerCase().includes(where.name_contains_nocase.toLowerCase()))
    if (where?.token1_symbol_contains_nocase)
      pools = pools.filter(pool => pool.name.toLowerCase().includes(where.token1_symbol_contains_nocase.toLowerCase()))
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
  catch {
    return []
  }
}

export async function getCharts(query?: { networks: string }) {
  try {
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    const [daySnapshots, marketDaySnapshots] = await Promise.all([
      daySnapshotsByChainIds({ chainIds }),
      marketDaySnapshotsByChainIds({ chainIds: [ParachainId.MOONBEAM] })],
    )
    const dateSnapshotMap = new Map<number, [number, number]>()
    let latestDateTimestamp = 0
    const latestSnapshotMap = new Map<number, DaySnapshot>()
    for (const snapshot of daySnapshots) {
      const dateTimestamp = getUnixTime(new Date(snapshot.date))
      if (dateTimestamp > latestDateTimestamp)
        latestDateTimestamp = dateTimestamp
      const value = latestSnapshotMap.get(snapshot.chainId)
      if (!value || dateTimestamp > getUnixTime(new Date(value.date)))
        latestSnapshotMap.set(snapshot.chainId, snapshot)
    }
    for (const snapshot of latestSnapshotMap.values()) {
      if (latestDateTimestamp > getUnixTime(new Date(snapshot.date))) {
        daySnapshots.unshift({
          ...snapshot,
          date: fromUnixTime(latestDateTimestamp),
          dailyVolumeUSD: '0',
        })
      }
    }
    for (const snapshot of daySnapshots) {
      const dateTimestamp = getUnixTime(new Date(snapshot.date))
      const value = dateSnapshotMap.get(dateTimestamp)
      dateSnapshotMap.set(
        dateTimestamp,
        value
          ? [value[0] + Number(snapshot.tvlUSD), value[1] + Number(snapshot.dailyVolumeUSD)]
          : [Number(snapshot.tvlUSD), Number(snapshot.dailyVolumeUSD)],
      )
    }

    const marketDateSnapshotMap = new Map<number, [number, number]>()
    for (const snapshot of marketDaySnapshots) {
      const dateTimestamp = getUnixTime(new Date(snapshot.date))
      marketDateSnapshotMap.set(
        dateTimestamp,
        [snapshot.totalLiquidityUSD, snapshot.dailyVolumeUSD],
      )
    }

    // tvl x,y arrays
    const tvl: [number[], number[], number[]] = [[], [], []]

    // vol x,y arrays
    const vol: [number[], number[], number[]] = [[], [], []]

    dateSnapshotMap.forEach(([liquidity, volume], date) => {
      const marketDateSnapshot = marketDateSnapshotMap.get(date)

      tvl[0].push(date)
      tvl[1].push(liquidity)
      const marketLiquidity = marketDateSnapshot?.[0]
      tvl[2].push(marketLiquidity ?? 0)

      vol[0].push(date)
      vol[1].push(volume)
      const marketVolume = marketDateSnapshot?.[1]
      vol[2].push(marketVolume ?? 0)
    })

    return [tvl, vol]
  }
  catch {
    return []
  }
}
