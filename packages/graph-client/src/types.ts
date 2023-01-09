import type {
  PairByIdQuery,
  PairDayData,
  PairHourData,
  StableSwapsQuery,
  TokensQuery,
  TxStatusQuery,
  UserPoolsQuery,
} from './__generated__/types-and-hooks'

export enum POOL_TYPE {
  STANDARD_POOL = 'STANDARD_POOL',
  STABLE_POOL = 'STABLE_POOL',
}

export type TokenQueryData = NonNullable<TokensQuery['tokens']>[number]
export interface Token extends TokenQueryData {
  chainId: number
}
export type PairQueryData = NonNullable<PairByIdQuery['pairById']>
export type StableSwapQueryData = NonNullable<StableSwapsQuery['stableSwaps']>[number]

export type PairLiquidityPositionQueryData = NonNullable<UserPoolsQuery['userById']>['liquidityPositions'][number]
export type StableSwapLiquidityPositionQueryData = NonNullable<UserPoolsQuery['userById']>['stableSwapLiquidityPositions'][number]

export type PoolHourData = Pick<PairHourData, 'id' | 'hourlyVolumeUSD' | 'reserveUSD' | 'hourStartUnix'>
export type PoolDayData = Pick<PairDayData, 'id' | 'dailyVolumeUSD' | 'reserveUSD' | 'date'>

export interface Pair extends Omit<
  PairQueryData,
  'pairHourData' | 'pairDayData'
> {
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  address: string
  token0: Token
  token1: Token
  poolHourData: PoolHourData[]
  poolDayData: PoolDayData[]
  apr: number
  feeApr: number
  volume1d: number
  fees1d: number
}

export interface StableSwap extends Omit<
  StableSwapQueryData,
  'tokens' | 'tvlUSD' | 'stableSwapHourData' | 'stableSwapDayData'
> {
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  reserveUSD: string
  tokens: Token[]
  poolHourData: PoolHourData[]
  poolDayData: PoolDayData[]
  apr: number
  feeApr: number
  volume1d: number
  fees1d: number
}

export type Pool = Pair | StableSwap

export interface LiquidityPosition<T extends POOL_TYPE> {
  type: T
  id: string
  liquidityTokenBalance: string
  chainId: number
  chainName: string
  chainShortName: string
  balance: number
  valueUSD: number
  pool: T extends POOL_TYPE.STANDARD_POOL ? Pair : StableSwap
}

export type TxStatusQueryData = NonNullable<TxStatusQuery>['extrinsics'][number]
