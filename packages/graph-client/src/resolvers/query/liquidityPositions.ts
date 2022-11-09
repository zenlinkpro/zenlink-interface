import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import type { LiquidityPositionMeta } from '../../queries'
import { fetchUserPools } from '../../queries'

export interface Pair {
  id: string
  chainId: number
  chainName: string
  chainShortName: string
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
  pairDayData: {
    id: string
    dailyVolumeUSD: string
    date: string
  }[]
  totalSupply: string
  reserveUSD: string
  reserve0: string
  reserve1: string
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

export const liquidityPositions = async (chainIds: number[], user: string) => {
  const transformer = (liquidityPosition: LiquidityPositionMeta, chainId: number) => {
    const vloumeUSDOneWeek = liquidityPosition.pair.pairDayData.reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(liquidityPosition.pair?.reserveUSD) > 500
      ? (vloumeUSDOneWeek * 0.0015 * 365) / (Number(liquidityPosition.pair?.reserveUSD) * 7)
      : 0
    const apr = Number(feeApr)

    return {
      ...liquidityPosition,
      id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(liquidityPosition.liquidityTokenBalance),
      valueUSD: Number(liquidityPosition.liquidityTokenBalance) * Number(liquidityPosition.pair.reserveUSD) / Number(liquidityPosition.pair.totalSupply),
      pair: {
        ...liquidityPosition.pair,
        id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        token0: {
          ...liquidityPosition.pair.token0,
          chainId,
        },
        token1: {
          ...liquidityPosition.pair.token1,
          chainId,
        },
        apr: String(apr),
        feeApr: String(feeApr),
      },
    }
  }

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchUserPools(chainId, user)
          .then(data =>
            data.data
              ? data.data.liquidityPositions.map(position => transformer(position, chainId))
              : [],
          ),
      ),
  ]).then((positions) => {
    return positions.flat().reduce<LiquidityPosition[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, [])
  })
}
