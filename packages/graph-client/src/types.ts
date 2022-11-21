export enum POOL_TYPE {
  STANDARD_POOL = 'STANDARD_POOL',
  STABLE_POOL = 'STABLE_POOL',
}

export interface PairMeta {
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

export interface LiquidityPosition extends LiquidityPositionMeta {
  chainId: number
  chainName: string
  chainShortName: string
  balance: number
  valueUSD: number
  pair: Pair
}
