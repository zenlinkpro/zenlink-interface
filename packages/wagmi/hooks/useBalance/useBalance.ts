import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount, Native } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { useEffect, useMemo } from 'react'
import { useReadContracts, useBalance as useWagmiBalance } from 'wagmi'
import { type Address, isAddress, zeroAddress } from 'viem'
import { erc20Abi } from 'viem'
import { useBlockNumber } from '../useBlockNumber'
import type { BalanceMap } from './types'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseBalances = (params: UseBalancesParams) => (
  | Pick<ReturnType<typeof useReadContracts>, 'isError' | 'isLoading'>
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
  const blockNumber = useBlockNumber(chainId)
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    isError: isNativeError,
    refetch: nativeBalanceRefetch,
  } = useWagmiBalance({
    address: account as Address,
    chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
  })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      currencies.reduce<[Token[], Address[][]]>(
        (acc, currencies) => {
          if (chainId && currencies && isAddress(currencies.wrapped.address)) {
            acc[0].push(currencies.wrapped)
            acc[1].push([currencies.wrapped.address as Address])
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
        chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
        address: token[0],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account as Address],
      } as const
    })
    return input
  }, [validatedTokenAddresses, chainId, account])

  const { data, isError, isLoading, refetch: tokensBalanceRefetch } = useReadContracts({
    contracts,
    allowFailure: true,
  })

  const balanceMap: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}

    if (data?.length !== contracts.length)
      return result
    for (let i = 0; i < validatedTokenAddresses.length; i++) {
      const value = data[i]?.result
      const amount = value ? JSBI.BigInt(value.toString()) : undefined
      if (!result[validatedTokens[i].address])
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (amount)
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')
    }

    result[zeroAddress] = chainId && nativeBalance?.value !== undefined
      ? Amount.fromRawAmount(Native.onChain(chainId), nativeBalance.value.toString())
      : undefined

    return result
  }, [data, contracts.length, nativeBalance, chainId, validatedTokenAddresses.length, validatedTokens])

  useEffect(() => {
    if (watch && enabled && blockNumber) {
      nativeBalanceRefetch()
      tokensBalanceRefetch()
    }
  }, [blockNumber, enabled, nativeBalanceRefetch, tokensBalanceRefetch, watch])

  return useMemo(() => ({
    data: balanceMap,
    isLoading: isLoading || isNativeLoading,
    isError: isError || isNativeError,
  }), [balanceMap, isLoading, isNativeLoading, isError, isNativeError])
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
      ? data?.[currency.isNative ? zeroAddress : currency.wrapped.address]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [isError, isLoading, currency, data])
}
