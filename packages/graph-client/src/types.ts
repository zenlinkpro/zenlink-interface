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
  pairDayData: {
    id: string
    dailyVolumeUSD: string
    date: string
  }[]
}

export interface LiquidityPositionMeta {
  id: string
  liquidityTokenBalance: string
  pair: PairMeta
}

export interface UserPools {
  userById: {
    liquidityPositions: LiquidityPositionMeta[]
  }
}

export interface Pair extends PairMeta {
  chainId: number
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
  apr: string
  feeApr: string
}

export interface LiquidityPosition extends LiquidityPositionMeta {
  chainId: number
  chainName: string
  chainShortName: string
  balance: number
  valueUSD: number
  pair: Pair
}
