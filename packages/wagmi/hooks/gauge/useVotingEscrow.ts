import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import { type Address, erc20Abi } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { VotingEscrow } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { Amount, ZLK } from '@zenlink-interface/currency'
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

  const lockedZLKCall = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: ZLK[chainId ?? -1].wrapped.address as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [veContract[chainId ?? -1] as Address],
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

  const {
    isLoading: isLockedZLKLoading,
    isError: isLockedZLKError,
    data: lockedZLKData,
    refetch: refetchLockedZLK,
  } = useReadContract(lockedZLKCall)

  useEffect(() => {
    if (config?.enabled && blockNumber) {
      refetchLockPosition()
      refetchSupply()
      refetchLockedZLK()
    }
  }, [blockNumber, config?.enabled, refetchLockPosition, refetchLockedZLK, refetchSupply])

  return useMemo(() => {
    if (!chainId || supplyData === undefined) {
      return {
        isLoading: isSupplyLoading,
        isError: isSupplyError,
        data: undefined,
      }
    }

    return {
      isLoading: isLockPositionLoading || isSupplyLoading || isLockedZLKLoading,
      isError: isLockPositionError || isSupplyError || isLockedZLKError,
      data: new VotingEscrow(
        {
          amount: JSBI.BigInt(lockPositionData?.[0].toString() || '0'),
          expiry: JSBI.BigInt(lockPositionData?.[1].toString() || '0'),
        },
        JSBI.BigInt(supplyData.toString()),
        Amount.fromRawAmount(ZLK[chainId], lockedZLKData?.toString() || 0),
      ),
    }
  }, [chainId, isLockPositionError, isLockPositionLoading, isLockedZLKError, isLockedZLKLoading, isSupplyError, isSupplyLoading, lockPositionData, lockedZLKData, supplyData])
}
