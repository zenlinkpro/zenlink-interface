import type { Token } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import { Amount } from '@zenlink-interface/currency'
import { useEffect, useMemo } from 'react'
import { erc20Abi, zeroAddress } from 'viem'
import { useReadContract } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'

export function useERC20Allowance(
  watch: boolean,
  token?: Token,
  owner?: string,
  spender?: string,
): Amount<Token> | undefined {
  const args = useMemo(() => [owner || '', spender || ''], [owner, spender])
  const blockNumber = useBlockNumber(token?.chainId)
  const { data, refetch } = useReadContract({
    address: (token?.address ?? zeroAddress) as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: args as [Address, Address],
  })

  useEffect(() => {
    if (watch && !!token && blockNumber)
      refetch()
  }, [blockNumber, refetch, token, watch])

  return data !== undefined && token ? Amount.fromRawAmount(token, data.toString()) : undefined
}
