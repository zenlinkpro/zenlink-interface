import { WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import type { Address } from '@wagmi/core'
import { wnative } from '../abis'

export function getWNATIVEContractConfig(chainId: number | undefined) {
  return {
    address: (chainId ? WNATIVE_ADDRESS[chainId] : '') as Address,
    abi: wnative,
  }
}

export function useWNATIVEContract(chainId: number | undefined) {
  return getWNATIVEContractConfig(chainId)
}
