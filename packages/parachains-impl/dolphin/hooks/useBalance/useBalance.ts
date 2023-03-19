import type { QueryableStorageEntry } from '@polkadot/api/types'
import type { PalletAssetsAssetAccount } from '@polkadot/types/lookup'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { isZenlinkAddress } from '@zenlink-interface/format'
import { JSBI } from '@zenlink-interface/math'
import {useAccount, useApi, useCall, useCallMulti, useNativeBalancesAll} from '@zenlink-interface/polkadot'
// import type { OrmlAccountData } from '@zenlink-types/bifrost/interfaces'
import {useEffect, useMemo} from 'react'
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

  // console.log('validate Account:' + account + ', Token sie' + validatedTokens.length + ',' + JSON.stringify(validatedTokens))
  // if (validatedTokens.length > 0) {
  //   for (let i = 0; i < validatedTokens.length; i++) {
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     useEffect(() => {
  //       const addr = validatedTokens[i].wrapped.address
  //       const assid = addressToCurrencyId(addr)
  //       const fetchBalance = async () => {
  //         // await api?.query.assets.account(assid, account)
  //         await api?.query.system.account(account)
  //       }
  //       const fetchRes = fetchBalance()
  //       console.log('fetch addr: '+ addr + ',' + assid + ',result:' + JSON.stringify(fetchRes))
  //     })
  //   }
  // }

  const balances = useCallMulti<PalletAssetsAssetAccount[]>({
    chainId,
    calls: (api && isAccount(account))
      ? validatedTokens
        .map(currency => [api.query.assets.account, [addressToCurrencyId(currency.wrapped.address), account]])
        .filter((call): call is [QueryableStorageEntry<'promise'>, ...any[]] => Boolean(call[0]))
      : [],
    options: { enabled: enabled && Boolean(api && isAccount(account)) },
  })
  const balanceMap: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}
    // if (balances.length !== 0)
    // console.log('balances size:' + balances.length + ',tokens size:' + validatedTokens.length + ',balance:' + JSON.stringify(balances))

    if (balances.length !== validatedTokens.length)
      return result

    for (let i = 0; i < validatedTokens.length; i++) {
      console.log('balance[' + i + ']:' + JSON.stringify(balances[i]) + ',addr:' + validatedTokens[i].address)
      // const value = (balances[i] as PalletAssetsAssetAccount).balance
      const value = balances[i]?.balance
      const amount = value ? JSBI.BigInt(value.toString()) : undefined

      if (!result[validatedTokens[i].address])
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (amount)
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (isNativeCurrency(validatedTokens[i]))
        result[validatedTokens[i].wrapped.address] = Amount.fromRawAmount(validatedTokens[i], nativeBalancesAll?.freeBalance.toString() || '0')
    }
    return result
  }, [balances, nativeBalancesAll?.freeBalance, validatedTokens])

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

    // console.log('addr:' + currency.wrapped.address + ',bal:' + balance)
    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [isError, isLoading, currency, data])
}
