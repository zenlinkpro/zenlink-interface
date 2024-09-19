import type { MarketByIdQuery, MarketDaySnapshotsQuery } from './__generated__/market-types'
import type {
  ZenlinkInfo as _ZenlinkInfo,
  DaySnapshotsQuery,
  Farm,
  PairByIdQuery,
  PairDayData,
  PairHourData,
  SingleTokenLocksQuery,
  StableSwapsQuery,
  TokensQuery,
  TxStatusQuery,
  UserPoolsQuery,
} from './__generated__/types-and-hooks'

export enum POOL_TYPE {
  STANDARD_POOL = 'STANDARD_POOL',
  STABLE_POOL = 'STABLE_POOL',
  SINGLE_TOKEN_POOL = 'SINGLE_TOKEN_POOL',
}

export type TokenQueryData = NonNullable<TokensQuery['tokens']>[number]
export interface Token extends TokenQueryData {
  chainId: number
}
export type PairQueryData = NonNullable<PairByIdQuery['pairById']>
export type StableSwapQueryData = NonNullable<StableSwapsQuery['stableSwaps']>[number]
export type SingleTokenLockQueryData = NonNullable<SingleTokenLocksQuery['singleTokenLocks']>[number]
export type MarketQueryData = NonNullable<MarketByIdQuery['marketById']>

export type PairLiquidityPositionQueryData = NonNullable<UserPoolsQuery['userById']>['liquidityPositions'][number]
export type StableSwapLiquidityPositionQueryData = NonNullable<UserPoolsQuery['userById']>['stableSwapLiquidityPositions'][number]
export type StakePositionQueryData = NonNullable<UserPoolsQuery['userById']>['stakePositions'][number]

export type PoolHourData = Pick<PairHourData, 'id' | 'hourlyVolumeUSD' | 'reserveUSD' | 'hourStartUnix'>
export type PoolDayData = Pick<PairDayData, 'id' | 'dailyVolumeUSD' | 'reserveUSD' | 'date'>

export type PoolFarm = Pick<Farm, 'id' | 'incentives' | 'pid' | 'stakeApr'>

export interface SingleTokenLock extends Omit<
  SingleTokenLockQueryData,
  'singleTokenLockHourData' | 'singleTokenLockDayData' | 'farm'
> {
  id: string
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  address: string
  token: Token
  reserveUSD: string
  farm?: PoolFarm[]
  poolHourData: PoolHourData[]
  poolDayData: PoolDayData[]
  apr: number
  bestStakeApr: number
  swapFee: number
  feeApr: number
  volume1d: number
  volume7d: number
  fees1d: number
  fees7d: number
}
export interface Pair extends Omit<
  PairQueryData,
  'pairHourData' | 'pairDayData' | 'farm'
> {
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  address: string
  farm?: PoolFarm[]
  token0: Token
  token1: Token
  poolHourData: PoolHourData[]
  poolDayData: PoolDayData[]
  apr: number
  bestStakeApr: number
  swapFee: number
  feeApr: number
  volume1d: number
  volume7d: number
  fees1d: number
  fees7d: number
}

export interface StableSwap extends Omit<
  StableSwapQueryData,
  'tokens' | 'tvlUSD' | 'stableSwapHourData' | 'stableSwapDayData' | 'farm'
> {
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  farm?: PoolFarm[]
  reserveUSD: string
  tokens: Token[]
  poolHourData: PoolHourData[]
  poolDayData: PoolDayData[]
  apr: number
  bestStakeApr: number
  swapFee: number
  feeApr: number
  volume1d: number
  volume7d: number
  fees1d: number
  fees7d: number
}

export type Pool = Pair | StableSwap | SingleTokenLock

export interface LiquidityPosition<T extends POOL_TYPE> {
  type: T
  id: string
  liquidityTokenBalance: string
  chainId: number
  chainName: string
  chainShortName: string
  balance: number
  valueUSD: number
  pool: T extends POOL_TYPE.STANDARD_POOL
    ? Pair
    : T extends POOL_TYPE.SINGLE_TOKEN_POOL
      ? SingleTokenLock
      : StableSwap
  stakedBalance: string
  unstakedBalance: string
}

export interface MarketGraphData extends MarketQueryData {
  address: string
  chainId: number
  chainName: string
  chainShortName: string
  underlyingAPY: number
  impliedAPY: number
  fixedROI: number
  longYieldROI: number
}

export type TxStatusQueryData = NonNullable<TxStatusQuery>['extrinsics'][number]
export type DaySnapshotsQueryData = NonNullable<DaySnapshotsQuery>['zenlinkDayInfos'][number]
export type MarketDaySnapshotsQueryData = NonNullable<MarketDaySnapshotsQuery>['factoryDayData'][number]

export interface DaySnapshot extends DaySnapshotsQueryData {
  chainId: number
  chainName: string
  chainShortName: string
}

export interface MarketDaySnapshot extends MarketDaySnapshotsQueryData {
  chainId: number
  chainName: string
  chainShortName: string
}

export type ZenlinkInfo = Pick<_ZenlinkInfo, 'totalTvlUSD' | 'totalVolumeUSD'>

export interface VotePositionData {
  user: string
  bias: bigint
  slope: bigint
  timestamp: number
  pool: string
}
