import { STABLE_SWAP_FEE_NUMBER, STANDARD_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import omit from 'lodash.omit'
import { fetchTokensByIds, fetchUserPools } from '../../queries'
import type {
  LiquidityPosition,
  PairLiquidityPositionQueryData,
  PairQueryData,
  SingleTokenLockQueryData,
  StableSwapLiquidityPositionQueryData,
  StableSwapQueryData,
  StakePositionQueryData,
  TokenQueryData,
} from '../../types'
import { POOL_TYPE } from '../../types'

async function standardLiquidityPositionTransformer(liquidityPosition: PairLiquidityPositionQueryData[],
  stakePosition: StakePositionQueryData[],
  chainId: number) {
  const unstaked = liquidityPosition.map((position) => {
    return {
      id: position.id,
      pair: position.pair,
      balance: position.liquidityTokenBalance,
    }
  })
  const staked = stakePosition.map((position) => {
    return {
      id: position.id,
      pair: position.farm.pair,
      balance: position.liquidityStakedBalance,
    }
  })

  const positionMap: Record<string, LiquidityPosition<POOL_TYPE.STANDARD_POOL>> = {}

  const pairTransformer = (pair: PairQueryData, chainId: number): LiquidityPosition<POOL_TYPE.STANDARD_POOL> => {
    const vloumeUSDOneWeek = pair.pairDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(pair?.reserveUSD) > 500
      ? (vloumeUSDOneWeek * STANDARD_SWAP_FEE_NUMBER * 365) / (Number(pair?.reserveUSD) * 7)
      : 0

    const farms = pair.farm ?? []
    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number(cur.stakeApr)
      return stakeApr > best ? stakeApr : best
    }, 0)
    const apr = Number(feeApr) + bestStakeApr
    // we don't need volume1d for liquidity-position
    const volume1d = 0
    const volume7d = 0
    const fees1d = volume1d * STANDARD_SWAP_FEE_NUMBER
    const fees7d = volume7d * STANDARD_SWAP_FEE_NUMBER

    return {
      liquidityTokenBalance: '0',
      stakedBalance: '0',
      unstakedBalance: '0',
      type: POOL_TYPE.STANDARD_POOL,
      id: `${chainShortName[chainId]}:${pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(0),
      valueUSD: Number(0) * Number(pair.reserveUSD) / Number(pair.totalSupply),
      pool: {
        ...omit(pair, ['pairDayData', 'farm']),
        type: POOL_TYPE.STANDARD_POOL,
        name: `${pair.token0.symbol}-${pair.token1.symbol}`,
        address: pair.id,
        id: `${chainShortName[chainId]}:${pair.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        token0: {
          ...pair.token0,
          chainId,
        },
        token1: {
          ...pair.token1,
          chainId,
        },
        poolHourData: [],
        poolDayData: pair.pairDayData,
        apr,
        bestStakeApr,
        swapFee: STANDARD_SWAP_FEE_NUMBER,
        feeApr,
        volume1d,
        volume7d,
        fees1d,
        fees7d,
      },
    }
  }

  unstaked.forEach((us) => {
    const position = positionMap[us.pair.id]
    if (!position)
      positionMap[us.pair.id] = pairTransformer(us.pair as PairQueryData, chainId)
    const positionEntry = positionMap[us.pair.id]
    positionEntry.liquidityTokenBalance = us.balance
    positionEntry.stakedBalance = us.balance
    positionEntry.balance = Number(us.balance)
    positionEntry.valueUSD = Number(positionEntry.liquidityTokenBalance) * Number(us.pair.reserveUSD) / Number(us.pair.totalSupply)
  })

  staked.forEach((s) => {
    if (!s.pair)
      return
    const position = positionMap[s.pair.id]
    if (!position)
      positionMap[s.pair.id] = pairTransformer(s.pair as PairQueryData, chainId)
    const positionEntry = positionMap[s.pair.id]
    positionEntry.liquidityTokenBalance = (BigInt(s.balance) + BigInt(positionEntry.liquidityTokenBalance)).toString()
    positionEntry.stakedBalance = (BigInt(s.balance) + BigInt(positionEntry.stakedBalance)).toString()
    positionEntry.balance = Number(positionEntry.liquidityTokenBalance)
    positionEntry.valueUSD = Number(positionEntry.liquidityTokenBalance) * Number(s.pair.reserveUSD) / Number(s.pair.totalSupply)
  })

  return Object.entries(positionMap).map(p => p[1]).filter(p => p.balance > 0)
}

async function singleTokenLockLiquidityPositionTransformer(stakePosition: StakePositionQueryData[],
  chainId: number) {
  const staked = stakePosition
    .filter(position => !!position.farm.singleTokenLock)
    .map(position => ({
      id: position.id,
      singleTokenLock: position.farm.singleTokenLock,
      balance: position.liquidityStakedBalance,
    }))

  const positionMap: Record<string, LiquidityPosition<POOL_TYPE.SINGLE_TOKEN_POOL>> = {}

  const singleTokenLockTransformer = (singleTokenLock: SingleTokenLockQueryData, chainId: number): LiquidityPosition<POOL_TYPE.SINGLE_TOKEN_POOL> => {
    const feeApr = 0
    const farms = singleTokenLock.farm ?? []
    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number(cur.stakeApr)
      return stakeApr > best ? stakeApr : best
    }, 0)
    const apr = Number(feeApr) + bestStakeApr
    // we don't need volume1d for liquidity-position
    const volume1d = 0
    const volume7d = 0
    const fees1d = 0
    const fees7d = 0

    return {
      liquidityTokenBalance: '0',
      stakedBalance: '0',
      unstakedBalance: '0',
      type: POOL_TYPE.SINGLE_TOKEN_POOL,
      id: `${chainShortName[chainId]}:${singleTokenLock.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(0),
      valueUSD: Number(0) * Number(singleTokenLock.totalLiquidityUSD) / Number(singleTokenLock.totalLiquidity),
      pool: {
        ...singleTokenLock,
        ...omit(singleTokenLock, ['pairDayData', 'farm', 'reserveUSD']),
        type: POOL_TYPE.SINGLE_TOKEN_POOL,
        name: `${singleTokenLock.token.symbol}`,
        address: singleTokenLock.id,
        id: `${chainShortName[chainId]}:${singleTokenLock.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        token: {
          ...singleTokenLock.token,
          chainId,
        },
        poolHourData: [],
        poolDayData: [],
        reserveUSD: '0',
        apr,
        bestStakeApr,
        farm: [],
        swapFee: 0,
        feeApr,
        volume1d,
        volume7d,
        fees1d,
        fees7d,
      },
    }
  }
  staked.forEach((item) => {
    if (!item.singleTokenLock)
      return
    const position = positionMap[item.singleTokenLock.id]
    if (!position)
      positionMap[item.singleTokenLock.id] = singleTokenLockTransformer(item.singleTokenLock as SingleTokenLockQueryData, chainId)
    const positionEntry = positionMap[item.singleTokenLock.id]
    positionEntry.liquidityTokenBalance = (BigInt(item.balance) + BigInt(positionEntry.liquidityTokenBalance)).toString()
    positionEntry.stakedBalance = (BigInt(item.balance) + BigInt(positionEntry.stakedBalance)).toString()
    positionEntry.balance = Number(positionEntry.liquidityTokenBalance)
    positionEntry.valueUSD = Number(positionEntry.liquidityTokenBalance) * Number(item.singleTokenLock.totalLiquidityUSD) / Number(item.singleTokenLock.totalLiquidity)
  })

  return Object.entries(positionMap).map(item => item[1]).filter(item => item.balance > 0) ?? []
}

async function stableLiquidityPositionTransformer(liquidityPosition: StableSwapLiquidityPositionQueryData[],
  stakePosition: StakePositionQueryData[],
  chainId: number,
  tokenMetaMap: { [id: string]: TokenQueryData } = {}) {
  const unstaked = liquidityPosition
    .map(position => ({
      id: position.id,
      stableSwap: position.stableSwap,
      balance: position.liquidityTokenBalance,
    }))
  const staked = stakePosition
    .map(position => ({
      id: position.id,
      stableSwap: position.farm.stableSwap,
      balance: position.liquidityStakedBalance,
    }))
    .filter(item => !!item.stableSwap)

  const positionMap: Record<string, LiquidityPosition<POOL_TYPE.STABLE_POOL>> = {}

  const stableSwapTransformer = (stableSwap: StableSwapQueryData, chainId: number): LiquidityPosition<POOL_TYPE.STABLE_POOL> => {
    const vloumeUSDOneWeek = stableSwap.stableSwapDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(stableSwap?.tvlUSD) > 500
      ? (vloumeUSDOneWeek * STABLE_SWAP_FEE_NUMBER * 365) / (Number(stableSwap?.tvlUSD) * 7)
      : 0

    const farms = stableSwap.farm ?? []
    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number(cur.stakeApr)
      return stakeApr > best ? stakeApr : best
    }, 0)
    const apr = Number(feeApr) + bestStakeApr
    // we don't need volume1d for liquidity-position
    const volume1d = 0
    const volume7d = 0
    const fees1d = volume1d * STANDARD_SWAP_FEE_NUMBER
    const fees7d = volume7d * STANDARD_SWAP_FEE_NUMBER

    return {
      ...stableSwap,
      liquidityTokenBalance: '0',
      stakedBalance: '0',
      unstakedBalance: '0',
      type: POOL_TYPE.STABLE_POOL,
      id: `${chainShortName[chainId]}:${stableSwap.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Number(0),
      valueUSD: Number(0) * Number(stableSwap.tvlUSD) / Number(stableSwap.lpTotalSupply),
      pool: {
        ...omit(stableSwap, ['stableSwapDayData', 'farm']),
        type: POOL_TYPE.STABLE_POOL,
        reserveUSD: stableSwap.tvlUSD,
        name: '4pool', // TODO: Generate different names for the pools
        id: `${chainShortName[chainId]}:${stableSwap.id}`,
        tokens: [...stableSwap.tokens].map(tokenAddress => Object.assign(tokenMetaMap[tokenAddress], { chainId })),
        chainId,
        farm: [],
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        apr,
        bestStakeApr,
        swapFee: STABLE_SWAP_FEE_NUMBER,
        feeApr,
        volume1d,
        volume7d,
        fees1d,
        fees7d,
        poolHourData: [],
        poolDayData: [...stableSwap.stableSwapDayData || []]
          .map(data => ({
            ...data,
            reserveUSD: data.tvlUSD,
          })),
      },
    }
  }

  unstaked.forEach((item) => {
    const position = positionMap[item.stableSwap.id]
    if (!position)
      positionMap[item.stableSwap.id] = stableSwapTransformer(item.stableSwap as StableSwapQueryData, chainId)
    const positionEntry = positionMap[item.stableSwap.id]
    positionEntry.liquidityTokenBalance = item.balance
    positionEntry.stakedBalance = item.balance
    positionEntry.balance = Number(item.balance)
    positionEntry.valueUSD = Number(positionEntry.liquidityTokenBalance) * Number(item.stableSwap.tvlUSD) / Number(item.stableSwap.lpTotalSupply)
  })

  staked.forEach((item) => {
    if (!item.stableSwap)
      return
    const position = positionMap[item.stableSwap.id]
    if (!position)
      positionMap[item.stableSwap.id] = stableSwapTransformer(item.stableSwap as StableSwapQueryData, chainId)
    const positionEntry = positionMap[item.stableSwap.id]
    positionEntry.liquidityTokenBalance = (BigInt(item.balance) + BigInt(positionEntry.liquidityTokenBalance)).toString()
    positionEntry.stakedBalance = (BigInt(item.balance) + BigInt(positionEntry.stakedBalance)).toString()
    positionEntry.balance = Number(positionEntry.liquidityTokenBalance)
    positionEntry.valueUSD = Number(positionEntry.liquidityTokenBalance) * Number(item.stableSwap.tvlUSD) / Number(item.stableSwap.lpTotalSupply)
  })

  return Object.entries(positionMap).map(item => item[1]).filter(item => item.balance > 0)
}

export async function liquidityPositions(chainIds: number[], user: string) {
  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchUserPools(chainId, user)
          .then(async (data) => {
            const standardLiquidityPosition = await standardLiquidityPositionTransformer(data?.data?.liquidityPositions ?? [], data?.data?.stakePositions ?? [], chainId)
            const singleTokenLiquidityPosition = await singleTokenLockLiquidityPositionTransformer(data.data?.stakePositions ?? [], chainId)

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

              const stableSwapLiquidityPosition = await stableLiquidityPositionTransformer(data.data?.stableSwapLiquidityPositions ?? [], data?.data?.stakePositions ?? [], chainId, tokenMetaMap)

              return [
                ...stableSwapLiquidityPosition,
                ...standardLiquidityPosition,
                ...singleTokenLiquidityPosition,
              ]
            }
            else {
              return data.data
                ? [
                    ...standardLiquidityPosition,
                    ...singleTokenLiquidityPosition,
                  ]
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
