import type { Token } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'
import { BigNumber } from 'ethers'
import { useEffect, useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { permit2 } from '../abis'
import { useBlockNumber } from './useBlockNumber'

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
  enable?: boolean,
): Permit2AllowanceData | undefined {
  const args = useMemo(() => [owner || '', token?.address || '', spender || ''], [owner, spender, token?.address])

  const blockNumber = useBlockNumber(token?.chainId)
  const { data, refetch } = useReadContract({
    address: PERMIT2_ADDRESS,
    abi: permit2,
    functionName: 'allowance',
    args: args as [Address, Address, Address],
  })

  useEffect(() => {
    if (watch && enable && blockNumber)
      refetch()
  }, [blockNumber, enable, refetch, watch])

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
