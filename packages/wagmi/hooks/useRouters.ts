import type { TradeVersion } from '@zenlink-interface/amm'
import { useMemo } from 'react'
import { getSwapRouterContractConfig } from './useSwapRouter'

export function useRouters(
  chainId: number | undefined,
  enableNetworks: number[],
  version?: TradeVersion,
) {
  const config = getSwapRouterContractConfig(chainId, version)

  return useMemo(() => {
    if (!version)
      return undefined

    return chainId && enableNetworks.includes(chainId)
      ? config
      : undefined
  }, [version, chainId, enableNetworks, config])
}
