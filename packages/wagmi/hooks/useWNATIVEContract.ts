import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import { usePublicClient } from 'wagmi'

import type { Address } from '@wagmi/core'
import { getContract } from '@wagmi/core'
import { wnative } from '../abis'

export const getWNATIVEContractConfig = (chainId: number | undefined) => ({
  address: (chainId ? WNATIVE_ADDRESS[chainId] : '') as Address,
  abi: wnative,
})

export function useWNATIVEContract(chainId: number | undefined) {
  return getContract({
    ...getWNATIVEContractConfig(chainId),
    walletClient: usePublicClient({ chainId: chainsParachainIdToChainId[chainId ?? -1] }),
  })
}
