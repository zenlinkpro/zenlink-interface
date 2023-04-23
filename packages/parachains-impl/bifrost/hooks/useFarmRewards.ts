import type { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { zenlinkAssetIdToAddress } from '@zenlink-interface/format'
import { JSBI } from '@zenlink-interface/math'
import { useAccount, useApi, useCall, useCallMulti } from '@zenlink-interface/polkadot'
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

  const [value, setValue] = useState<any>([])

  const blockNumber = useCall<any>({
    chainId,
    fn: api?.query.system.number,
    params: [],
    options: { enabled: enabled && !!api },
  })

  const poolInfoCalls = useMemo(() => {
    return (api)
      ? pids.map(pid => [api.query.farming.poolInfos, pid]) as any
      : []
  }, [api, pids])

  const poolInfos = useCallMulti({
    chainId,
    calls: poolInfoCalls,
    options: { enabled: enabled && Boolean(api) },
  })

  const poolInfoMap = useMemo(() => {
    return ((poolInfos ?? []) as any[]).map((item, i) => {
      let poolInfo
      if (item?.isSome)
        poolInfo = item?.value?.toJSON()
      return {
        pid: Number(pids[i]),
        poolInfo,
      }
    }).reduce((map: any, info) => {
      map[info.pid!] = info
      return map
    }, {})
  }, [pids, poolInfos])

  const userShareInfo = useCallMulti<any>({
    chainId,
    calls: (api && isAccount(account))
      ? pids
        .map(pid => [api.query.farming.sharesAndWithdrawnRewards, [pid, account]])
        .filter((call): call is [QueryableStorageEntry<'promise'>, [number, string]] => Boolean(call[0]))
      : [],
    options: { enabled: enabled && Boolean(api && isAccount(account)) },
  })

  const userShareInfoMap: any = useMemo(() => {
    const result: any = {}
    if (userShareInfo.length !== pids.length)
      return result
    for (let i = 0; i < pids.length; i++) {
      const value = userShareInfo[i]?.value?.toJSON()
      if (value)
        result[pids[i]!] = value
    }
    return result
  }, [userShareInfo, pids])

  useEffect(() => {
    if (!api || !isAccount(account))
      return

    Promise.all(pids.map((pid) => {
      return Promise.all([
        (api.rpc as any).farming.getFarmingRewards(...[account, Number(pid)]),
        (api.rpc as any).farming.getGaugeRewards(...[account, Number(pid)]),
      ])
    })).then((result) => {
      const userReward = result.map((reward, index) => {
        const pid = pids[index]
        const [farmingRewards, gaugeRewards] = reward

        const userRewards = Object.entries([...farmingRewards, ...gaugeRewards].map((item) => {
          const token = nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(item[0].toHuman(), chainId as number)
          return {
            token: zenlinkAssetIdToAddress(token),
            amount: item[1].toString(),
          }
        }).reduce((map, cur) => {
          if (!map[cur.token]) {
            map[cur.token] = {
              token: cur.token,
              amount: cur.amount,
            }
          }
          else {
            map[cur.token].amount = JSBI.add(JSBI.BigInt(cur.amount), JSBI.BigInt(map[cur.token].amount)).toString()
          }
          return map
        }, {} as Record<string, { token: string; amount: string }>)).map(item => item[1])

        return {
          pid,
          userRewards,
        }
      })

      setValue(userReward)
    })
  }, [account, api, blockNumber, chainId, isAccount, pids])

  const userFarmInfos: any[] = value

  const userFarmInfosMap: FarmRewardsMap = useMemo(() => {
    const result: FarmRewardsMap = {}
    if (userFarmInfos.length !== pids.length)
      return result
    for (let i = 0; i < pids.length; i++) {
      const value = userFarmInfos[i]
      const poolInfo = poolInfoMap[pids[i]!]?.poolInfo
      const claimLimitTime = poolInfo?.claimLimitTime ?? 0
      const userShareInfo = userShareInfoMap[pids[i]!]
      const claimLastBlock = userShareInfo?.claimLastBlock ?? 0

      if (value)
        value.nextClaimableBlock = claimLastBlock + claimLimitTime
      result[pids[i]!] = value
    }
    return result
  }, [pids, poolInfoMap, userFarmInfos, userShareInfoMap])
  return useMemo(() => ({
    data: userFarmInfosMap,
    isLoading: isAccount(account) && (!userFarmInfos.length),
    isError: !isAccount(account),
  }), [userFarmInfosMap, isAccount, account, userFarmInfos.length])
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
