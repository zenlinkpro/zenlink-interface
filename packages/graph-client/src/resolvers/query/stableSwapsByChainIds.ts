import { STABLE_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import omit from 'lodash.omit'
import { fetchStableSwaps, fetchTokensByIds } from '../../queries'
import type { StableSwap, StableSwapQueryData, TokenQueryData } from '../../types'
import { POOL_TYPE } from '../../types'

export interface QueryStableSwapsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: string
}

export const stableSwapsByChainIds = async ({
  chainIds,
  limit = 10,
  orderBy = 'tvlUSD_DESC',
}: QueryStableSwapsByChainIdsArgs) => {
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
      const vloumeUSDOneWeek = stableSwapMeta.stableSwapDayData
        .slice(0, 7)
        .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
      const feeApr = Number(stableSwapMeta.tvlUSD) > 500
        ? (vloumeUSDOneWeek * STABLE_SWAP_FEE_NUMBER * 365) / (Number(stableSwapMeta.tvlUSD) * 7)
        : 0
      const apr = Number(feeApr)
      const currentHourIndex = parseInt((new Date().getTime() / 3600000).toString(), 10)
      const hourStartUnix = Number(currentHourIndex - 24) * 3600000
      const volume1d = stableSwapMeta.stableSwapHourData
        .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix)
        .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
      const fees1d = volume1d * STABLE_SWAP_FEE_NUMBER

      return {
        ...omit(stableSwapMeta, ['stableSwapDayData', 'stableSwapHourData']),
        type: POOL_TYPE.STABLE_POOL,
        name: '4pool',
        id: `${chainShortName[chainId]}:${stableSwapMeta.id}`,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        reserveUSD: stableSwapMeta.tvlUSD,
        tokens: [...stableSwapMeta.tokens].map(tokenAddress => Object.assign(tokenMetaMap[tokenAddress], { chainId })),
        apr,
        feeApr,
        volume1d,
        fees1d,
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
