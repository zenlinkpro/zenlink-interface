import type { Contract } from 'ethers'
import { BaseContract } from 'ethers'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { getSwapRouterContractConfig } from './useSwapRouter'

export function useRouters(
  chainId: number | undefined,
  enableNetworks: number[],
): [Contract | undefined] {
  const { data: signerOrProvider } = useSigner()
  const config = getSwapRouterContractConfig(chainId)
  return useMemo(() => {
    return [
      chainId && enableNetworks.includes(chainId)
        ? new BaseContract(config.address, config.abi, signerOrProvider?.provider)
        : undefined,
    ]
  }, [chainId, enableNetworks, config, signerOrProvider?.provider])
}
