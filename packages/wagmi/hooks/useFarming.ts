import { ParachainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import { Address, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'
import { farming } from '../abis'

const farmingAddress: Record<number, string> = {
  [ParachainId.ASTAR]: '0x460ee9DBc82B2Be84ADE50629dDB09f6A1746545',
  [ParachainId.MOONBEAM]: '0xD6708344553cd975189cf45AAe2AB3cd749661f4',
  [ParachainId.MOONRIVER]: '0xf4Ec122d32F2117674Ce127b72c40506c52A72F8',
}

export const getFarmingContractConfig = (chainId: number | undefined, address?: string) => ({
  address: (address ?? farmingAddress[chainId ?? -1]) as Address,
  abi: farming,
})

export function useFarmingContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useWalletClient()

  return useMemo(() => {
    if (!chainId || !(chainId in farmingAddress))
      return undefined

    return getContract({
      ...getFarmingContractConfig(chainId),
      walletClient: signerOrProvider ?? undefined,
    })
  }, [chainId, signerOrProvider])
}
