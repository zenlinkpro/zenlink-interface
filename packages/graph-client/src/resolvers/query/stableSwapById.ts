import { STABLE_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortNameToChainId } from '@zenlink-interface/chain'
import omit from 'lodash.omit'
import { fetchStableSwapById, fetchTokensByIds } from '../../queries'
import type { StableSwap, StableSwapQueryData, TokenQueryData } from '../../types'
import { POOL_TYPE } from '../../types'

export const stableSwapById = async (id: string): Promise<StableSwap | undefined> => {
  const [chainShortName, address] = id.split(':') as [string, string]
  const chainId = chainShortNameToChainId[chainShortName]

  const stableSwapTransformer = async (stableSwap: StableSwapQueryData, chainId: number) => {
    const vloumeUSDOneWeek = stableSwap.stableSwapDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(stableSwap.tvlUSD) > 500
      ? (vloumeUSDOneWeek * STABLE_SWAP_FEE_NUMBER * 365) / (Number(stableSwap.tvlUSD) * 7)
      : 0
    const currentHourIndex = parseInt((new Date().getTime() / 3600000).toString(), 10)
    const hourStartUnix = Number(currentHourIndex - 24) * 3600000
    const volume1d = stableSwap.stableSwapHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix)
      .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
    const volume7d = stableSwap.stableSwapDayData
      .slice(0, 7).reduce((volume, { dailyVolumeUSD }) => volume + Number(dailyVolumeUSD), 0)
    const fees1d = volume1d * STABLE_SWAP_FEE_NUMBER
    const fees7d = volume7d * STABLE_SWAP_FEE_NUMBER

    const farms = stableSwap.farm ?? []
    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number(cur.stakeApr)
      return stakeApr > best ? stakeApr : best
    }, 0)
    const apr = Number(feeApr) + bestStakeApr

    const tokens = new Set<string>()
    stableSwap.tokens.forEach(token => tokens.add(token))
    const tokenMetas = await fetchTokensByIds(chainId, tokens)
    const tokenMetaMap = tokenMetas.data?.reduce<{ [id: string]: TokenQueryData }>((map, current) => {
      if (!map[current.id])
        map[current.id] = current

      return map
    }, {}) ?? {}

    return {
      ...omit(stableSwap, ['stableSwapDayData', 'stableSwapHourData']),
      type: POOL_TYPE.STABLE_POOL,
      name: '4pool',
      id: `${chainShortName}:${stableSwap.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName,
      reserveUSD: stableSwap.tvlUSD,
      tokens: [...stableSwap.tokens].map(tokenAddress => Object.assign(tokenMetaMap[tokenAddress], { chainId })),
      apr,
      bestStakeApr,
      feeApr,
      swapFee: STABLE_SWAP_FEE_NUMBER,
      volume1d,
      volume7d,
      fees1d,
      fees7d,
      poolHourData: [...stableSwap.stableSwapHourData || []]
        .map(data => ({
          ...data,
          reserveUSD: data.tvlUSD,
        })),
      poolDayData: [...stableSwap.stableSwapDayData || []]
        .map(data => ({
          ...data,
          reserveUSD: data.tvlUSD,
        })),
    }
  }

  return fetchStableSwapById(chainId, address)
    .then(async data => (data.data ? await stableSwapTransformer(data.data, chainId) : undefined) as any)
}
