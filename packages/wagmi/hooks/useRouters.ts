import type { TradeVersion } from '@zenlink-interface/amm'
import type { Contract } from 'ethers'
import { BaseContract } from 'ethers'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { getSwapRouterContractConfig } from './useSwapRouter'

export function useRouters(
  chainId: number | undefined,
  enableNetworks: number[],
  version?: TradeVersion,
): [Contract | undefined] {
  const { data: signerOrProvider } = useSigner()
  const config = getSwapRouterContractConfig(chainId, version)
  return useMemo(() => {
    if (!version)
      return [undefined]
    return [
      chainId && enableNetworks.includes(chainId)
        ? new BaseContract(config.address, config.abi, signerOrProvider?.provider)
        : undefined,
    ]
  }, [version, chainId, enableNetworks, config.address, config.abi, signerOrProvider?.provider])
}
