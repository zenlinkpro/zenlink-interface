import { chainName, chainShortNameToChainId } from '@zenlink-interface/chain'
import omit from 'lodash.omit'
import { fetchPairById } from '../../queries'
import type { Pair, PairQueryData } from '../../types'
import { POOL_TYPE } from '../../types'

export const pairById = async (id: string): Promise<Pair | undefined> => {
  const [chainShortName, address] = id.split(':') as [string, string]
  const chainId = chainShortNameToChainId[chainShortName]

  const pairTransformer = (pair: PairQueryData, chainId: number) => {
    const vloumeUSDOneWeek = pair.pairDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(pair.reserveUSD) > 500
      ? (vloumeUSDOneWeek * 0.0015 * 365) / (Number(pair.reserveUSD) * 7)
      : 0
    const apr = Number(feeApr)
    const currentHourIndex = parseInt((new Date().getTime() / 3600000).toString(), 10)
    const hourStartUnix = Number(currentHourIndex - 24) * 3600000
    const volume1d = pair.pairHourData
      .filter(hourData => Number(hourData.hourStartUnix) >= hourStartUnix)
      .reduce((volume, { hourlyVolumeUSD }) => volume + Number(hourlyVolumeUSD), 0)
    const fees1d = volume1d * 0.0015

    return {
      ...omit(pair, ['pairHourData', 'pairDayData']),
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
      poolHourData: pair.pairHourData,
      poolDayData: pair.pairDayData,
      apr,
      feeApr,
      volume1d,
      fees1d,
    }
  }

  return fetchPairById(chainId, address)
    .then(data => data.data ? pairTransformer(data.data, chainId) : undefined)
}
