import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import type { LiquidityPositionMeta } from '../../queries'
import { fetchUserPools } from '../../queries'

export interface LiquidityPosition extends LiquidityPositionMeta {
  chainId: number
  chainName: string
  chainShortName: string
  balance: number
  pair: {
    id: string
    chainId: number
    chainName: string
    chainShortName: string
    token0: {
      symbol: string
    }
    token1: {
      symbol: string
    }
    totalSupply: string
    reserveUSD: string
    apr: string
    feeApr: string
  }
}

export const liquidityPositions = async (chainIds: number[], user: string) => {
  const transformer = (liquidityPosition: LiquidityPositionMeta, chainId: number) => {
    const feeApr = Number(liquidityPosition.pair?.reserveUSD) > 5000 ? 0.003 : 0
    const apr = Number(feeApr)

    return {
      ...liquidityPosition,
      id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(liquidityPosition.liquidityTokenBalance),
      pair: {
        ...liquidityPosition.pair,
        id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
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
