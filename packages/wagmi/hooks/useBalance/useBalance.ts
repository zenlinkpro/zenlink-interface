import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount, Native } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { useMemo } from 'react'
import { erc20ABI, useContractReads, useBalance as useWagmiBalance } from 'wagmi'

import type { BalanceMap } from './types'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseBalances = (params: UseBalancesParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useWagmiBalance>, 'isError' | 'isLoading'>
) & {
  data: BalanceMap
}

export const useBalances: UseBalances = ({
  watch = true,
  enabled = true,
  chainId,
  account,
  currencies,
}) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    isError: isNativeError,
  } = useWagmiBalance({
    addressOrName: account,
    chainId,
    enabled,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
    keepPreviousData: true,
  })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      currencies.reduce<[Token[], string[][]]>(
        (acc, currencies) => {
          if (chainId && currencies && isAddress(currencies.wrapped.address)) {
            acc[0].push(currencies.wrapped)
            acc[1].push([currencies.wrapped.address])
          }

          return acc
        },
        [[], []],
      ),
    [chainId, currencies],
  )

  const contracts = useMemo(() => {
    const input = validatedTokenAddresses.map((token) => {
      return {
        chainId,
        addressOrName: token[0],
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
      }
    })
    return input
  }, [validatedTokenAddresses, chainId, account])

  const { data, isError, isLoading } = useContractReads({
    contracts,
    enabled,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
    keepPreviousData: true,
  })

  const tokens: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}

    if (data?.length !== contracts.length)
      return result
    for (let i = 0; i < validatedTokenAddresses.length; i++) {
      const value = data[i]
      const amount = value ? JSBI.BigInt(value.toString()) : undefined
      if (!result[validatedTokens[i].address])
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (amount)
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')
    }

    return result
  }, [contracts.length, data, validatedTokenAddresses.length, validatedTokens])

  return useMemo(() => {
    tokens[AddressZero] = chainId && nativeBalance?.value
      ? Amount.fromRawAmount(Native.onChain(chainId), nativeBalance.value.toString())
      : undefined

    return {
      data: tokens,
      isLoading: isLoading || isNativeLoading,
      isError: isError || isNativeError,
    }
  }, [tokens, chainId, nativeBalance?.value, isLoading, isNativeLoading, isError, isNativeError])
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
    const balance = currency
      ? data?.[currency.isNative ? AddressZero : currency.wrapped.address]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [isError, isLoading, currency, data])
}
