import type { QueryableStorageEntry } from '@polkadot/api/types'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { isZenlinkAddress } from '@zenlink-interface/format'
import { JSBI } from '@zenlink-interface/math'
import { useAccount, useApi, useCallMulti, useNativeBalancesAll } from '@zenlink-interface/polkadot'
import { useMemo } from 'react'
import { addressToCurrencyId, isNativeCurrency } from '../../libs'
import type { NodePrimitivesCurrency } from '../../types'
import type { BalanceMap } from './types'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
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
  enabled = true,
}) => {
  const api = useApi(chainId)
  const { isAccount } = useAccount()
  const nativeBalancesAll = useNativeBalancesAll(chainId, account, enabled)

  const validatedTokens = useMemo(
    () =>
      currencies.filter(
        (currency): currency is Token =>
          !!chainId && !!currency && isZenlinkAddress(currency.wrapped.address),
      ),
    [chainId, currencies],
  )

  const calls = useMemo(
    () => api && isAccount(account)
      ? validatedTokens
        .map(currency => [api.query.assets.account, [addressToCurrencyId(currency.wrapped.address), account]])
        // @ts-expect-error
        .filter((call): call is [QueryableStorageEntry<'promise'>, [string, NodePrimitivesCurrency]] => Boolean(call[0]))
      : []
    , [account, api, isAccount, validatedTokens],
  )

  const balances = useCallMulti<any[]>({
    chainId,
    // @ts-expect-error
    calls,
    options: { enabled: enabled && Boolean(api && isAccount(account)) },
  })

  const balanceMap: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}
    if (!account || balances.length !== validatedTokens.length)
      return result
    for (let i = 0; i < validatedTokens.length; i++) {
      const value = balances[i]?.value?.balance?.toString()
      const amount = value ? JSBI.BigInt(value.toString()) : undefined

      if (!result[validatedTokens[i].address])
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (amount)
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      // BNC
      if (isNativeCurrency(validatedTokens[i]))
        result[validatedTokens[i].wrapped.address] = Amount.fromRawAmount(validatedTokens[i], nativeBalancesAll?.freeBalance.toString() || '0')
    }
    return result
  }, [balances, nativeBalancesAll?.freeBalance, validatedTokens, account])

  return useMemo(() => ({
    data: balanceMap,
    isLoading: isAccount(account) && (!nativeBalancesAll || !balances.length),
    isError: !isAccount(account),
  }), [balanceMap, isAccount, account, nativeBalancesAll, balances.length])
}

interface UseBalanceParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  enabled?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
  data: Amount<Type> | undefined
}

export const useBalance: UseBalance = ({
  chainId,
  account,
  currency,
  enabled,
}) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({ chainId, currencies, account, enabled })

  return useMemo(() => {
    const balance = currency
      ? data?.[currency.wrapped.address]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [isError, isLoading, currency, data])
}
