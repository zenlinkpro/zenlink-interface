import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { Address, useBalance as useWagmiBalance } from 'wagmi'
import { useContractReads } from 'wagmi'
import type { BigNumber } from 'ethers'
import { getFarmingContractConfig } from '../useFarming'

export type FarmBalanceMap = Record<string, string>

interface UseFarmBalancesParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseFarmBalances = (params: UseFarmBalancesParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useWagmiBalance>, 'isError' | 'isLoading'>
) & {
  data: FarmBalanceMap
}

export const useFarmBalances: UseFarmBalances = ({
  watch = true,
  enabled = true,
  chainId,
  account,
  pids = [],
}) => {
  const contracts = useMemo(() => {
    const wagmiFarmingContract = getFarmingContractConfig(chainId)

    return pids.map(pid => ({
      address: wagmiFarmingContract.address as Address,
      abi: wagmiFarmingContract.abi,
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      functionName: 'getUserInfo',
      args: [pid, account],
    }))
  }, [account, chainId, pids])

  const { data, isError, isLoading } = useContractReads({
    contracts,
    enabled,
    allowFailure: true,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
    keepPreviousData: true,
  })

  const balanceMap: FarmBalanceMap = useMemo(() => {
    const result: FarmBalanceMap = {}

    if (data?.length !== contracts.length)
      return result
    for (let i = 0; i < pids.length; i++) {
      const pid = pids[i]
      const value = data[i]

      if (pid && value) {
        const value = data[i] as { amount: BigNumber }
        const amount = value.amount.toString()
        result[pid] = amount
      }
    }

    return result
  }, [data, contracts.length, pids])

  return useMemo(() => ({
    data: balanceMap,
    isLoading,
    isError,
  }), [balanceMap, isLoading, isError])
}

interface UseFarmBalanceParams {
  account: string | undefined
  chainId?: ParachainId
  pid: number
  enabled?: boolean
  watch?: boolean
}

type UseFarmBalance = (params: UseFarmBalanceParams) => Pick<ReturnType<typeof useFarmBalances>, 'isError' | 'isLoading'> & {
  data: string | undefined
}

export const useFarmBalance: UseFarmBalance = ({
  watch = true,
  chainId,
  account,
  enabled = true,
  pid,
}) => {
  const pids = useMemo(() => [pid], [pid])
  const { data, isLoading, isError } = useFarmBalances({ watch, chainId, pids, account, enabled })

  return useMemo(() => {
    const balance = pid
      ? data?.[pid]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [pid, data, isError, isLoading])
}
