import type { QueryableStorageEntry } from '@polkadot/api/types'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { useAccount, useApi, useCallMulti } from '@zenlink-interface/polkadot'
import { useMemo } from 'react'

export type FarmBalanceMap = Record<string, string>

interface UseFarmBalancesParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
}

type UseFarmBalances = (params: UseFarmBalancesParams) => {
  data: FarmBalanceMap
  isLoading: boolean
  isError: boolean
}

export const useFarmBalances: UseFarmBalances = ({
  chainId,
  account,
  enabled = true,
  pids,
}) => {
  const api = useApi(chainId)
  const { isAccount } = useAccount()

  const balances = useCallMulti<any>({
    chainId,
    calls: (api && isAccount(account))
      ? pids
        .map(pid => [api.query.farming.sharesAndWithdrawnRewards, [pid, account]])
        .filter((call): call is [QueryableStorageEntry<'promise'>, [number, string]] => Boolean(call[0]))
      : [],
    options: { enabled: enabled && Boolean(api && isAccount(account)) },
  })

  const farmBalanceMap: FarmBalanceMap = useMemo(() => {
    const result: FarmBalanceMap = {}
    if (balances.length !== pids.length)
      return result
    for (let i = 0; i < pids.length; i++) {
      const value = balances[i]?.value?.share?.toString() ?? '0'
      const amount = value ? JSBI.BigInt(value.toString()) : undefined
      if (amount)
        result[pids[i]!] = value
    }
    return result
  }, [balances, pids])

  return useMemo(() => ({
    data: farmBalanceMap,
    isLoading: isAccount(account) && !balances.length && !!pids.length,
    isError: !isAccount(account),
  }), [farmBalanceMap, isAccount, account, balances.length, pids.length])
}

interface UseFarmBalanceParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  pid: number
  enabled?: boolean
}

type UseFarmBalance = (params: UseFarmBalanceParams) => Pick<ReturnType<typeof useFarmBalances>, 'isError' | 'isLoading'> & {
  data: string | undefined
}

export const useFarmBalance: UseFarmBalance = ({
  chainId,
  account,
  enabled,
  pid,
}) => {
  const pids = useMemo(() => [pid], [pid])
  const { data, isLoading, isError } = useFarmBalances({ chainId, pids, account, enabled })

  return useMemo(() => {
    const balance = pid
      ? data?.[pid]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [data, pid, isError, isLoading])
}
