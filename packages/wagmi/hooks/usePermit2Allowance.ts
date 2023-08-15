import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'
import type { Token } from '@zenlink-interface/currency'
import type { Address } from 'wagmi'
import { useContractRead } from 'wagmi'
import { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { permit2 } from '../abis'

export interface Permit2AllowanceData {
  amount: BigNumber
  nonce: number
  expiration: number
}

export function usePermit2Allowance(
  watch: boolean,
  token?: Token,
  owner?: string,
  spender?: string,
): Permit2AllowanceData | undefined {
  const args = useMemo(() => [owner || '', token?.address || '', spender || ''], [owner, spender, token?.address])

  const { data } = useContractRead({
    address: PERMIT2_ADDRESS,
    abi: permit2,
    functionName: 'allowance',
    args: args as [Address, Address, Address],
    watch,
    enabled: !!token && !!owner && !!spender,
  })

  return useMemo(() => {
    if (!token || !data)
      return undefined
    return {
      amount: BigNumber.from(data[0]),
      nonce: data[1],
      expiration: data[2],
    }
  }, [data, token])
}
