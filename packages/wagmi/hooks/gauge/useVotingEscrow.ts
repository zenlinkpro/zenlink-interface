import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { VotingEscrow } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { votingEscrow } from '../../abis'
import { useBlockNumber } from '../useBlockNumber'
import { veContract } from './config'

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

  const supplyCall = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: veContract[chainId ?? -1],
    abi: votingEscrow,
    functionName: 'totalSupplyStored',
  } as const), [chainId])

  const {
    isLoading: isLockPositionLoading,
    isError: isLockPositionError,
    data: lockPositionData,
    refetch: refetchLockPosition,
  } = useReadContract(lockPositionCall)

  const {
    isLoading: isSupplyLoading,
    isError: isSupplyError,
    data: supplyData,
    refetch: refetchSupply,
  } = useReadContract(supplyCall)

  useEffect(() => {
    if (config?.enabled && blockNumber) {
      refetchLockPosition()
      refetchSupply()
    }
  }, [blockNumber, config?.enabled, refetchLockPosition, refetchSupply])

  return useMemo(() => {
    if (supplyData === undefined) {
      return {
        isLoading: isSupplyLoading,
        isError: isSupplyError,
        data: undefined,
      }
    }

    return {
      isLoading: isLockPositionLoading || isSupplyLoading,
      isError: isLockPositionError || isSupplyError,
      data: new VotingEscrow(
        {
          amount: JSBI.BigInt(lockPositionData?.[0].toString() || '0'),
          expiry: JSBI.BigInt(lockPositionData?.[1].toString() || '0'),
        },
        JSBI.BigInt(supplyData.toString()),
      ),
    }
  }, [isLockPositionError, isLockPositionLoading, isSupplyError, isSupplyLoading, lockPositionData, supplyData])
}
