import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import type { useBalance as useWagmiBalance } from 'wagmi'
import { useReadContracts } from 'wagmi'
import { getFarmingContractConfig } from '../useFarming'
import { useBlockNumber } from '../useBlockNumber'

export type FarmBalanceMap = Record<string, string>

interface UseFarmBalancesParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseFarmBalances = (params: UseFarmBalancesParams) => (
  | Pick<ReturnType<typeof useReadContracts>, 'isError' | 'isLoading'>
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
      address: wagmiFarmingContract.address,
      abi: wagmiFarmingContract.abi,
      chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
      functionName: 'getUserInfo',
      args: [BigInt(pid!), account],
    }) as const)
  }, [account, chainId, pids])

  const blockNumber = useBlockNumber(chainId)
  const { data, isError, isLoading, refetch } = useReadContracts({
    contracts,
    allowFailure: true,
  })

  useEffect(() => {
    if (watch && enabled && blockNumber)
      refetch()
  }, [blockNumber, enabled, refetch, watch])

  const balanceMap: FarmBalanceMap = useMemo(() => {
    const result: FarmBalanceMap = {}

    if (data?.length !== contracts.length)
      return result
    for (let i = 0; i < pids.length; i++) {
      const pid = pids[i]
      const value = data[i]

      if (pid !== undefined && value.result) {
        const amount = value.result[0].toString()
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
