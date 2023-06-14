import type { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'wagmi'
import { useFarmBalances as useWagmiFarmBalances } from '@zenlink-interface/wagmi'
import { useFarmBalances as useBifrostBalances } from '@zenlink-interface/parachains-manta'
import { useMemo } from 'react'
import { isEvmNetwork } from '../../config'
import type { FarmBalanceMap } from './types'

interface UseFarmBalancesParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseFarmBalances = (params: UseFarmBalancesParams) => {
  data: FarmBalanceMap
  isLoading: boolean
  isError: boolean
}

export const useFarmBalances: UseFarmBalances = ({
  chainId,
  account,
  pids,
  enabled,
  watch,
}) => {
  const wagmiBalances = useWagmiFarmBalances({
    chainId,
    account: account as Address,
    pids,
    enabled: enabled && chainId && isEvmNetwork(chainId),
    watch,
  })

  const bifrostBalances = useBifrostBalances({
    chainId,
    account,
    pids,
  })

  return useMemo(() => {
    if (!chainId) {
      return {
        data: {},
        isLoading: false,
        isError: true,
      }
    }
    if (isEvmNetwork(chainId))
      return wagmiBalances
    return bifrostBalances
  }, [bifrostBalances, chainId, wagmiBalances])
}

interface UseFarmBalanceParams {
  account: string | undefined
  pid?: number
  chainId?: ParachainId
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
  pid,
  enabled = true,
}) => {
  const pids = useMemo(() => [pid], [pid])
  const { data, isLoading, isError } = useFarmBalances({ watch, chainId, pids, account, enabled })

  return useMemo(() => {
    const balance = (pid !== undefined) && chainId
      ? data?.[pid]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [pid, chainId, data, isError, isLoading])
}
