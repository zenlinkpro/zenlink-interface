import type { Address } from 'viem'
import { useMemo } from 'react'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export function useToken({
  address,
  chainId,
}: { address?: Address, chainId?: number }) {
  const { data, ...others } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: 'symbol',
      },
    ],
  })

  return useMemo(() => ({
    data: data && address
      ? {
          address,
          decimals: data[0],
          name: data[1],
          symbol: data[2],
        }
      : undefined,
    ...others,
  }), [address, data, others])
}
