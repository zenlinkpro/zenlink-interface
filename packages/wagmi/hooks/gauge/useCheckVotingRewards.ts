import type { Address } from 'viem'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import { useReadContracts } from 'wagmi'
import { z } from 'zod'
import { merkle } from '../../abis/merkle'

export const votingResultValidator = z.array(
  z.object({
    contractAddress: z.string(),
    index: z.number(),
    amount: z.string(),
    proof: z.array(z.string()),
  }),
)

interface UseCheckVotingRewardsReturn {
  isLoading: boolean
  isError: boolean
  data: z.infer<typeof votingResultValidator>
}

export function useCheckVotingRewards(
  chainId: number | undefined,
  data: z.infer<typeof votingResultValidator> | undefined,
): UseCheckVotingRewardsReturn {
  const contracts = useMemo(
    () => data?.length
      ? data.map(d => ({
          chainId: chainsParachainIdToChainId[chainId ?? -1],
          address: d.contractAddress as Address,
          abi: merkle,
          functionName: 'isClaimed',
          args: [d.index],
        } as const))
      : [],
    [chainId, data],
  )

  const { data: isClaimedDatas, isLoading, isError } = useReadContracts({ contracts })

  return useMemo(() => {
    if (!data || !isClaimedDatas) {
      return {
        isLoading,
        isError,
        data: [],
      }
    }

    return {
      isLoading,
      isError,
      data: data.filter((_, i) => {
        const result = isClaimedDatas[i].result
        if (result === undefined)
          return false
        return !result
      }),
    }
  }, [data, isClaimedDatas, isError, isLoading])
}
