import { STABLE_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import omit from 'lodash.omit'
import { fetchStableSwaps, fetchTokensByIds } from '../../queries'
import type { PoolFarm, StableSwap, StableSwapQueryData, TokenQueryData } from '../../types'
import { POOL_TYPE } from '../../types'
import { StableSwapOrderByInput } from '../../__generated__/types-and-hooks'

export interface QueryStableSwapsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: StableSwapOrderByInput
}

export async function stableSwapsByChainIds({
  chainIds,
  limit = 10,
  orderBy = StableSwapOrderByInput.TvlUsdDesc,
}: QueryStableSwapsByChainIdsArgs) {
  const stableSwapsTransformer = async (stableSwapMetas: StableSwapQueryData[], chainId: number) => {
    const tokens = new Set<string>()
    stableSwapMetas.forEach(stableSwap => stableSwap.tokens.forEach(token => tokens.add(token)))
    const tokenMetas = await fetchTokensByIds(chainId, tokens)
    const tokenMetaMap = tokenMetas.data?.reduce<{ [id: string]: TokenQueryData }>((map, current) => {
      if (!map[current.id])
        map[current.id] = current

      return map
    }, {}) ?? {}

    return stableSwapMetas.map((stableSwapMeta) => {
      const vloumeUSDOneWeek = stableSwapMeta.stableSwapDayData.slice(0, 7).reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
      const feeApr = Number(stableSwapMeta.tvlUSD) > 500
        ? (vloumeUSDOneWeek * STABLE_SWAP_FEE_NUMBER * 365) / (Number(stableSwapMeta.tvlUSD) * 7)
        : 0
      const currentHourIndex = Number.parseInt((new Date().getTime() / 3600000).toString(), 10)
      const hourStartUnix = Number(currentHourIndex - 24) * 3600000
      const volume1d = stableSwapMeta.stableSwapHourData.filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix).reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
      const volume7d = stableSwapMeta.stableSwapDayData.slice(0, 7).reduce((volume, { dailyVolumeUSD }) => volume + Number(dailyVolumeUSD), 0)
      const fees1d = volume1d * STABLE_SWAP_FEE_NUMBER
      const fees7d = volume7d * STABLE_SWAP_FEE_NUMBER

      const farms = stableSwapMeta.farm ?? []
      const bestStakeApr = farms.reduce((best, cur) => {
        const stakeApr = Number(cur.stakeApr)
        return stakeApr > best ? stakeApr : best
      }, 0)
      const apr = Number(feeApr) + bestStakeApr

      return {
        ...omit(stableSwapMeta, ['stableSwapDayData', 'stableSwapHourData', 'farm']),
        type: POOL_TYPE.STABLE_POOL,
        name: '4pool',
        id: `${chainShortName[chainId]}:${stableSwapMeta.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        reserveUSD: stableSwapMeta.tvlUSD,
        tokens: [...stableSwapMeta.tokens].map(tokenAddress => Object.assign(tokenMetaMap[tokenAddress], { chainId })),
        apr,
        bestStakeApr,
        swapFee: STABLE_SWAP_FEE_NUMBER,
        feeApr,
        volume1d,
        volume7d,
        fees1d,
        fees7d,
        farm: stableSwapMeta.farm as PoolFarm[],
        poolHourData: [...stableSwapMeta.stableSwapHourData || []]
          .map(data => ({
            ...data,
            reserveUSD: data.tvlUSD,
          })),
        poolDayData: [...stableSwapMeta.stableSwapDayData || []]
          .map(data => ({
            ...data,
            reserveUSD: data.tvlUSD,
          })),
      }
    })
  }

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchStableSwaps({ chainId, limit, orderBy })
          .then(async data =>
            data.data
              ? (await stableSwapsTransformer(data.data, chainId))
                  .filter(({ lpTotalSupply }) => Number(lpTotalSupply) > 0)
              : [],
          ),
      ),
  ]).then(pairs =>
    pairs.flat().reduce<StableSwap[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
