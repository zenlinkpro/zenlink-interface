import type { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { zenlinkAssetIdToAddress } from '@zenlink-interface/format'
import { JSBI } from '@zenlink-interface/math'
import { useAccount, useApi, useBlockNumber, useCallMulti } from '@zenlink-interface/polkadot'
import { useEffect, useMemo, useState } from 'react'
import type { QueryableStorageEntry } from '@polkadot/api/types'
import { nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId } from '../libs'

interface UserReward {
  token: string
  amount: string
}

interface FarmReward {
  pid: number
  nextClaimableBlock?: string
  nextClaimableTime?: string
  userRewards: UserReward[]
}

interface UseFarmsRewardsParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
}

type UseFarmsRewards = (params: UseFarmsRewardsParams) => {
  data: Record<number, FarmReward>
  isLoading: boolean
  isError: boolean
}

type FarmRewardsMap = Record<number, FarmReward>

export const useFarmsRewards: UseFarmsRewards = ({
  chainId,
  account,
  enabled = true,
  pids = [],
}) => {
  const api = useApi(chainId)
  const { isAccount } = useAccount()
  const [userRewards, setUserRewards] = useState<any[]>([])
  const blockNumber = useBlockNumber()

  const poolInfoCalls: [QueryableStorageEntry<'promise'>, number | undefined][] = useMemo(
    () => api
      ? pids.map(pid => [api.query.farming.poolInfos, pid])
      : [],
    [api, pids],
  )

  const poolInfos = useCallMulti<any[]>({
    chainId,
    calls: poolInfoCalls,
    options: { enabled: enabled && Boolean(api) },
  })

  const poolInfoMap = useMemo(
    () => poolInfos.reduce((map, info, i) => {
      const pid = pids[i]
      const poolInfo = info?.isSome
        ? info?.value?.toJSON()
        : undefined

      if ((pid === undefined) || !poolInfo)
        return map
      map[pid] = info
      return map
    }, {}),
    [pids, poolInfos],
  )

  const userShareInfo = useCallMulti<any[]>({
    chainId,
    calls: (api && isAccount(account))
      ? pids
        .map(pid => [api.query.farming.sharesAndWithdrawnRewards, [pid, account]])
        .filter((call): call is [QueryableStorageEntry<'promise'>, [number, string]] => Boolean(call[0]))
      : [],
    options: { enabled: enabled && Boolean(api && isAccount(account)) },
  })

  const userShareInfoMap = useMemo(() => {
    const result: { [pid: number]: any } = {}
    if (userShareInfo.length !== pids.length)
      return result
    for (let i = 0; i < pids.length; i++) {
      const pid = pids[i]
      const value = userShareInfo[i]?.value?.toJSON()
      if (value && pid !== undefined)
        result[pid] = value
    }
    return result
  }, [userShareInfo, pids])

  useEffect(() => {
    if (!api || !isAccount(account))
      return

    Promise.all(
      pids.map(pid => Promise.all([
        (api.rpc as any).farming.getFarmingRewards(...[account, Number(pid)]),
        (api.rpc as any).farming.getGaugeRewards(...[account, Number(pid)]),
      ])),
    )
      .then((result) => {
        const userReward = result.map((reward, index) => {
          const pid = pids[index]
          const [farmingRewards, gaugeRewards] = reward

          const userRewards = Object.entries([...farmingRewards, ...gaugeRewards]
            .map((item) => {
              const token = nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(
                item[0].toNumber(),
                chainId as number,
              )

              return {
                token: zenlinkAssetIdToAddress(token),
                amount: item[1].toString(),
              }
            })
            .reduce<Record<string, { token: string; amount: string }>>((map, cur) => {
              if (!map[cur.token]) {
                map[cur.token] = {
                  token: cur.token,
                  amount: cur.amount,
                }
              }
              else {
                map[cur.token].amount = JSBI.add(
                  JSBI.BigInt(cur.amount),
                  JSBI.BigInt(map[cur.token].amount),
                ).toString()
              }
              return map
            }, {}))
            .map(item => item[1])

          return { pid, userRewards }
        })

        setUserRewards(userReward)
      })
  }, [account, api, chainId, isAccount, pids, blockNumber])

  const userFarmInfosMap: FarmRewardsMap = useMemo(() => {
    const result: FarmRewardsMap = {}

    if (userRewards.length !== pids.length)
      return result

    for (let i = 0; i < pids.length; i++) {
      const value = userRewards[i]
      const poolInfo = poolInfoMap[pids[i]!]?.poolInfo
      const claimLimitTime = poolInfo?.claimLimitTime ?? 0
      const userShareInfo = userShareInfoMap[pids[i]!]
      const claimLastBlock = userShareInfo?.claimLastBlock ?? 0

      if (value)
        value.nextClaimableBlock = claimLastBlock + claimLimitTime
      result[pids[i]!] = value
    }
    return result
  }, [pids, poolInfoMap, userRewards, userShareInfoMap])

  return useMemo(() => ({
    data: userFarmInfosMap,
    isLoading: isAccount(account) && !userRewards.length && !!pids.length,
    isError: !isAccount(account),
  }), [userFarmInfosMap, isAccount, account, userRewards.length, pids.length])
}

interface UseFarmRewardsParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  pid: number
  enabled?: boolean
}

type UseFarmRewards = (params: UseFarmRewardsParams) => Pick<ReturnType<typeof useFarmsRewards>, 'isError' | 'isLoading'> & {
  data?: FarmReward
}

export const useFarmRewards: UseFarmRewards = ({
  chainId,
  account,
  enabled,
  pid,
}) => {
  const pids = useMemo(() => [pid], [pid])
  const { data, isLoading, isError } = useFarmsRewards({ chainId, pids, account, enabled })

  return useMemo(() => {
    const balance = pid
      ? data?.[pid]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [data, isError, isLoading, pid])
}
