import type { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'wagmi'
import { AddressZero } from '@ethersproject/constants'
import { useBalances as useWagmiBalances } from '@zenlink-interface/wagmi'
import { useBalances as useBifrostBalances } from '@zenlink-interface/parachains-manta'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useMemo } from 'react'
import { isEvmNetwork } from '../../config'
import type { BalanceMap } from './types'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseBalances = (params: UseBalancesParams) => {
  data: BalanceMap
  isLoading: boolean
  isError: boolean
}

export const useBalances: UseBalances = ({
  chainId,
  account,
  currencies,
  enabled,
  watch,
}) => {
  const wagmiBalances = useWagmiBalances({
    chainId,
    account: account as Address,
    currencies,
    enabled: enabled && chainId && isEvmNetwork(chainId),
    watch,
  })

  const bifrostBalances = useBifrostBalances({
    chainId,
    account,
    currencies,
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

interface UseBalanceParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
  data: Amount<Type> | undefined
}

export const useBalance: UseBalance = ({
  watch = true,
  chainId,
  account,
  currency,
  enabled = true,
}) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({ watch, chainId, currencies, account, enabled })

  return useMemo(() => {
    const balance = currency && chainId
      ? data?.[
        isEvmNetwork(chainId)
          ? currency.isNative
            ? AddressZero
            : currency.wrapped.address
          : currency.wrapped.address
      ]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [currency, chainId, data, isError, isLoading])
}
