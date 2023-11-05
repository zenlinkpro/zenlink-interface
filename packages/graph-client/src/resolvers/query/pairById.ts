import { STANDARD_SWAP_FEE_NUMBER } from '@zenlink-interface/amm'
import { chainName, chainShortNameToChainId } from '@zenlink-interface/chain'
import omit from 'lodash.omit'
import { fetchPairById } from '../../queries'
import type { Pair, PairQueryData, PoolFarm } from '../../types'
import { POOL_TYPE } from '../../types'

export async function pairById(id: string): Promise<Pair | undefined> {
  const [chainShortName, address] = id.split(':') as [string, string]
  const chainId = chainShortNameToChainId[chainShortName]

  const pairTransformer = (pair: PairQueryData, chainId: number): Pair => {
    const vloumeUSDOneWeek = pair.pairDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(pair.reserveUSD) > 500
      ? (vloumeUSDOneWeek * STANDARD_SWAP_FEE_NUMBER * 365) / (Number(pair.reserveUSD) * 7)
      : 0

    const farms = pair.farm ?? []
    const bestStakeApr = farms.reduce((best, cur) => {
      const stakeApr = Number(cur.stakeApr)
      return stakeApr > best ? stakeApr : best
    }, 0)
    const apr = Number(feeApr) + bestStakeApr
    const currentHourIndex = Number.parseInt((new Date().getTime() / 3600000).toString(), 10)
    const hourStartUnix = Number(currentHourIndex - 24) * 3600000
    const volume1d = pair.pairHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix)
      .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
    const volume7d = pair.pairDayData
      .slice(0, 7).reduce((volume, { dailyVolumeUSD }) => volume + Number(dailyVolumeUSD), 0)
    const fees1d = volume1d * STANDARD_SWAP_FEE_NUMBER
    const fees7d = volume7d * STANDARD_SWAP_FEE_NUMBER

    return {
      ...omit(pair, ['pairHourData', 'pairDayData', 'farm']),
      type: POOL_TYPE.STANDARD_POOL,
      name: `${pair.token0.symbol}-${pair.token1.symbol}`,
      address: pair.id,
      id: `${chainShortName}:${pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName,
      token0: {
        ...pair.token0,
        chainId,
      },
      token1: {
        ...pair.token1,
        chainId,
      },
      farm: pair.farm as PoolFarm[],
      poolHourData: pair.pairHourData,
      poolDayData: pair.pairDayData,
      apr,
      swapFee: STANDARD_SWAP_FEE_NUMBER,
      feeApr,
      volume1d,
      volume7d,
      fees1d,
      bestStakeApr,
      fees7d,
    }
  }

  return fetchPairById(chainId, address)
    .then(data => data.data ? pairTransformer(data.data, chainId) : undefined)
}
