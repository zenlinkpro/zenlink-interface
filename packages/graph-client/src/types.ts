export enum POOL_TYPE {
  STANDARD_POOL = 'STANDARD_POOL',
  STABLE_POOL = 'STABLE_POOL',
}

export interface TokenMeta {
  id: string
  name: string
  decimals: number
  symbol: string
}

export interface PairMeta {
  id: string
  token0: TokenMeta
  token1: TokenMeta
  totalSupply: string
  reserve0: string
  reserve1: string
  reserveUSD: string
  pairHourData: {
    id: string
    hourlyVolumeUSD: string
    reserveUSD: string
    hourStartUnix: string
  }[]
  pairDayData: {
    id: string
    dailyVolumeUSD: string
    reserveUSD: string
    date: string
  }[]
}

export interface StableSwapMeta {
  id: string
  address: string
  lpToken: string
  lpTotalSupply: string
  tokens: string[]
  balances: string[]
  swapFee: string
  tvlUSD: string
  stableSwapHourData: {
    id: string
    hourlyVolumeUSD: string
    tvlUSD: string
    hourStartUnix: string
  }[]
  stableSwapDayData: {
    id: string
    tvlUSD: string
    dailyVolumeUSD: string
    date: string
  }[]
}

export interface LiquidityPositionMeta {
  id: string
  liquidityTokenBalance: string
  pair: PairMeta
}

export interface StableSwapLiquidityPositionMeta {
  id: string
  liquidityTokenBalance: string
  stableSwap: StableSwapMeta
}

export interface UserPools {
  userById: {
    liquidityPositions: LiquidityPositionMeta[]
    stableSwapLiquidityPositions: StableSwapLiquidityPositionMeta[]
  }
}

export interface Pair extends PairMeta {
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  address: string
  token0: {
    id: string
    name: string
    decimals: number
    symbol: string
    chainId: number
  }
  token1: {
    id: string
    name: string
    decimals: number
    symbol: string
    chainId: number
  }
  apr: number
  feeApr: number
}

export interface StableSwap extends Omit<StableSwapMeta, 'tokens'> {
  type: POOL_TYPE
  name: string
  chainId: number
  chainName: string
  chainShortName: string
  tokens: {
    id: string
    name: string
    decimals: number
    symbol: string
    chainId: number
  }[]
  apr: number
  feeApr: number
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
