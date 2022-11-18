import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import { fetchUserPools } from '../../queries'
import type { LiquidityPosition, LiquidityPositionMeta } from '../../types'
import { POOL_TYPE } from '../../types'

export const liquidityPositions = async (chainIds: number[], user: string) => {
  const transformer = (liquidityPosition: LiquidityPositionMeta, chainId: number) => {
    const vloumeUSDOneWeek = liquidityPosition.pair.pairDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
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
        type: POOL_TYPE.STANDARD_POOL,
        name: `${liquidityPosition.pair.token0.symbol}-${liquidityPosition.pair.token1.symbol}`,
        address: liquidityPosition.pair.id,
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
        apr,
        feeApr,
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
  ]).then(positions =>
    positions.flat().reduce<LiquidityPosition[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
