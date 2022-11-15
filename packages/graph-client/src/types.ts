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
