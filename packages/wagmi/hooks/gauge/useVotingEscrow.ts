import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { VotingEscrow } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { votingEscrow } from '../../abis'
import { useBlockNumber } from '../useBlockNumber'

export const veContract: Record<number, Address> = {
  [ParachainId.MOONBEAM]: '0x1E80A824Ed280c5Ee783D76fdcB634a67C95Edb7',
}

interface UseVotingEscrowReturn {
  isLoading: boolean
  isError: boolean
  data: VotingEscrow | undefined
}

export function useVotingEscrow(
  chainId: number | undefined,
  config: { enabled?: boolean } = { enabled: true },
): UseVotingEscrowReturn {
  const blockNumber = useBlockNumber(chainId)
  const { address } = useAccount()

  const lockPositionCall = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: veContract[chainId ?? -1],
    abi: votingEscrow,
    functionName: 'positionData',
    args: [address as Address],
  } as const), [address, chainId])

  const { isError, isLoading, data, refetch } = useReadContract(lockPositionCall)

  useEffect(() => {
    if (config?.enabled && blockNumber && address)
      refetch()
  }, [address, blockNumber, config?.enabled, refetch])

  return useMemo(() => {
    if (!data) {
      return {
        isLoading,
        isError,
        data: undefined,
      }
    }

    return {
      isLoading,
      isError,
      data: new VotingEscrow({
        amount: JSBI.BigInt(data[0].toString()),
        expiry: JSBI.BigInt(data[1].toString()),
      }),
    }
  }, [data, isError, isLoading])
}
