import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { useEffect, useMemo } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { Gauge, type VeBalance, VotingEscrow } from '@zenlink-interface/market'
import { JSBI, ZERO } from '@zenlink-interface/math'
import { useBlockNumber } from '../useBlockNumber'
import { useMarkets } from '../markets'
import { votingController } from '../../abis'
import { votingControllerContract } from './config'

interface UseGaugesReturn {
  isLoading: boolean
  isError: boolean
  data: Gauge[] | undefined
}

export function useGauges(
  chainId: number | undefined,
  config: { enabled?: boolean } = { enabled: true },
): UseGaugesReturn {
  const blockNumber = useBlockNumber(chainId)
  const { address: account } = useAccount()
  const { data: markets } = useMarkets(chainId)
  const { data: activePools } = useGaugeActivePools(chainId)

  const poolDataCalls = useMemo(
    () => (activePools || []).map(pool => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: votingControllerContract[chainId ?? -1],
      abi: votingController,
      functionName: 'getPoolData',
      args: [pool, []],
    } as const)),
    [activePools, chainId],
  )

  const userVoteCall = useMemo(
    () => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: votingControllerContract[chainId ?? -1],
      abi: votingController,
      functionName: 'getUserData',
      args: [account as Address, activePools || []],
    } as const),
    [account, activePools, chainId],
  )

  const {
    data: poolsData,
    isLoading: isPoolsDataLoading,
    isError: isPoolsDataError,
    refetch: refetchPoolsData,
  } = useReadContracts({ contracts: poolDataCalls })

  const {
    data: userVote,
    refetch: refetchUserVote,
  } = useReadContract(userVoteCall)

  useEffect(() => {
    if (config.enabled && blockNumber) {
      refetchPoolsData()
      refetchUserVote()
    }
  }, [blockNumber, config.enabled, refetchPoolsData, refetchUserVote])

  return useMemo(() => {
    if (!poolsData) {
      return {
        isLoading: isPoolsDataLoading,
        isError: isPoolsDataError,
        data: undefined,
      }
    }

    const totalVotes = poolsData.reduce((total, pData, i) => {
      if (pData.result && activePools?.[i]) {
        const { bias, slope } = pData.result[2]
        const poolVote: VeBalance = {
          bias: JSBI.BigInt(bias.toString()),
          slope: JSBI.BigInt(slope.toString()),
        }
        return JSBI.add(total, VotingEscrow.getValue(poolVote))
      }
      return total
    }, ZERO)

    const result: Gauge[] = []
    poolsData.forEach((pData, i) => {
      if (pData.result && activePools?.[i]) {
        const poolAddress = activePools[i]
        const market = markets?.find(market => market.address === poolAddress)

        if (market) {
          const { bias, slope } = pData.result[2]
          const poolVote: VeBalance = {
            bias: JSBI.BigInt(bias.toString()),
            slope: JSBI.BigInt(slope.toString()),
          }

          const userVoteResult = userVote
            ? {
                totalVotedWeight: JSBI.BigInt(userVote[0].toString()),
                weight: JSBI.BigInt((userVote[1][i]?.weight || BigInt(0)).toString()),
              }
            : undefined

          const gauge = new Gauge(
            market,
            totalVotes,
            VotingEscrow.getValue(poolVote),
            userVoteResult,
          )
          result.push(gauge)
        }
      }
    })

    return {
      isLoading: isPoolsDataLoading,
      isError: isPoolsDataError,
      data: result,
    }
  }, [activePools, isPoolsDataError, isPoolsDataLoading, markets, poolsData, userVote])
}

interface UseGaugeActivePoolsReturn {
  isLoading: boolean
  isError: boolean
  data: readonly Address[] | undefined
}

export function useGaugeActivePools(
  chainId: number | undefined,
  config: { enabled?: boolean } = { enabled: true },
): UseGaugeActivePoolsReturn {
  const blockNumber = useBlockNumber(chainId)

  const activePoolsCall = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: votingControllerContract[chainId ?? -1],
    abi: votingController,
    functionName: 'getAllActivePools',
  } as const), [chainId])

  const { isError, isLoading, data, refetch } = useReadContract(activePoolsCall)

  useEffect(() => {
    if (config?.enabled && blockNumber)
      refetch()
  }, [blockNumber, config?.enabled, refetch])

  return useMemo(() => ({ isLoading, isError, data }), [data, isError, isLoading])
}
