import { getSwapRouterContractConfig } from '@zenlink-interface/wagmi'
import { AMM_ENABLED_NETWORKS } from 'config'
import type { Contract } from 'ethers'
import { BaseContract } from 'ethers'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'

export function useRouters(
  chainId: number | undefined,
): [Contract | undefined] {
  const { data: signerOrProvider } = useSigner()
  const config = getSwapRouterContractConfig(chainId)
  return useMemo(() => {
    return [
      chainId && AMM_ENABLED_NETWORKS.includes(chainId)
        ? new BaseContract(config.address, config.abi, signerOrProvider?.provider)
        : undefined,
    ]
  }, [chainId, signerOrProvider, config])
}
