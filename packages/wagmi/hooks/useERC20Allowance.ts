import { AddressZero } from '@ethersproject/constants'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { useMemo } from 'react'
import type { Address } from 'wagmi'
import { erc20ABI, useContractRead } from 'wagmi'

export function useERC20Allowance(
  watch: boolean,
  token?: Token,
  owner?: string,
  spender?: string,
): Amount<Token> | undefined {
  const args = useMemo(() => [owner || '', spender || ''], [owner, spender])
  const { data } = useContractRead({
    address: (token?.address ?? AddressZero) as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: args as [Address, Address],
    watch,
    enabled: !!token,
  })

  return data && token ? Amount.fromRawAmount(token, data.toString()) : undefined
}
