import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import { usePublicClient } from 'wagmi'

import WNATIVE_ABI from '../abis/wnative.json'
import { Address, getContract } from '@wagmi/core'

export const getWNATIVEContractConfig = (chainId: number | undefined) => ({
  address: (chainId ? WNATIVE_ADDRESS[chainId] : '') as Address,
  abi: WNATIVE_ABI,
})

export function useWNATIVEContract(chainId: number | undefined) {
  return getContract({
    ...getWNATIVEContractConfig(chainId),
    walletClient: usePublicClient({ chainId: chainsParachainIdToChainId[chainId ?? -1] }),
  })
}
