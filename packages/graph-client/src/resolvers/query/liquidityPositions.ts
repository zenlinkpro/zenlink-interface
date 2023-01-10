import { STABLE_SWAP_FEE_NUMBER, STANDARD_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import omit from 'lodash.omit'
import { fetchTokensByIds, fetchUserPools } from '../../queries'
import type {
  LiquidityPosition,
  PairLiquidityPositionQueryData,
  StableSwapLiquidityPositionQueryData,
  TokenQueryData,
} from '../../types'
import { POOL_TYPE } from '../../types'

export const liquidityPositions = async (chainIds: number[], user: string) => {
  const standardTransformer = (liquidityPosition: PairLiquidityPositionQueryData, chainId: number): LiquidityPosition<POOL_TYPE.STANDARD_POOL> => {
    const vloumeUSDOneWeek = liquidityPosition.pair.pairDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(liquidityPosition.pair?.reserveUSD) > 500
      ? (vloumeUSDOneWeek * STANDARD_SWAP_FEE_NUMBER * 365) / (Number(liquidityPosition.pair?.reserveUSD) * 7)
      : 0
    const apr = Number(feeApr)
    // we don't need volume1d for liquidity-position
    const volume1d = 0
    const fees1d = volume1d * STANDARD_SWAP_FEE_NUMBER

    return {
      ...liquidityPosition,
      type: POOL_TYPE.STANDARD_POOL,
      id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(liquidityPosition.liquidityTokenBalance),
      valueUSD: Number(liquidityPosition.liquidityTokenBalance) * Number(liquidityPosition.pair.reserveUSD) / Number(liquidityPosition.pair.totalSupply),
      pool: {
        ...omit(liquidityPosition.pair, ['pairDayData']),
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
        poolHourData: [],
        poolDayData: liquidityPosition.pair.pairDayData,
        apr,
        feeApr,
        volume1d,
        fees1d,
      },
    }
  }

  const stableTransformer = (
    liquidityPosition: StableSwapLiquidityPositionQueryData,
    chainId: number,
    tokenMetaMap: { [id: string]: TokenQueryData } = {},
  ): LiquidityPosition<POOL_TYPE.STABLE_POOL> => {
    const vloumeUSDOneWeek = liquidityPosition.stableSwap.stableSwapDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(liquidityPosition.stableSwap?.tvlUSD) > 500
      ? (vloumeUSDOneWeek * STABLE_SWAP_FEE_NUMBER * 365) / (Number(liquidityPosition.stableSwap?.tvlUSD) * 7)
      : 0
    const apr = Number(feeApr)
    // we don't need volume1d for liquidity-position
    const volume1d = 0
    const fees1d = volume1d * STABLE_SWAP_FEE_NUMBER

    return {
      ...liquidityPosition,
      type: POOL_TYPE.STABLE_POOL,
      id: `${chainShortName[chainId]}:${liquidityPosition.stableSwap.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(liquidityPosition.liquidityTokenBalance),
      valueUSD: Number(liquidityPosition.liquidityTokenBalance) * Number(liquidityPosition.stableSwap.tvlUSD) / Number(liquidityPosition.stableSwap.lpTotalSupply),
      pool: {
        ...omit(liquidityPosition.stableSwap, ['stableSwapDayData']),
        type: POOL_TYPE.STABLE_POOL,
        reserveUSD: liquidityPosition.stableSwap.tvlUSD,
        name: '4pool', // TODO: Generate different names for the pools
        id: `${chainShortName[chainId]}:${liquidityPosition.stableSwap.id}`,
        tokens: [...liquidityPosition.stableSwap.tokens].map(tokenAddress => Object.assign(tokenMetaMap[tokenAddress], { chainId })),
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        apr,
        feeApr,
        volume1d,
        fees1d,
        poolHourData: [],
        poolDayData: [...liquidityPosition.stableSwap.stableSwapDayData || []]
          .map(data => ({
            ...data,
            reserveUSD: data.tvlUSD,
          })),
      },
    }
  }

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchUserPools(chainId, user)
          .then(async (data) => {
            if (data.data?.stableSwapLiquidityPositions.length) {
              const { stableSwapLiquidityPositions } = data.data
              const tokens = new Set<string>()
              stableSwapLiquidityPositions.forEach(
                position => position.stableSwap.tokens.forEach(token => tokens.add(token)),
              )
              const tokenMetas = await fetchTokensByIds(chainId, tokens)
              const tokenMetaMap = tokenMetas.data?.reduce<{ [id: string]: TokenQueryData }>((map, current) => {
                if (!map[current.id])
                  map[current.id] = current

                return map
              }, {}) ?? {}
              return [
                ...data.data.stableSwapLiquidityPositions.map(position => stableTransformer(position, chainId, tokenMetaMap)),
                ...data.data.liquidityPositions.map(position => standardTransformer(position, chainId)),
              ]
            }
            else {
              return data.data
                ? data.data.liquidityPositions.map(position => standardTransformer(position, chainId))
                : []
            }
          }),
      ),
  ]).then(positions =>
    positions.flat().reduce<LiquidityPosition<POOL_TYPE>[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
