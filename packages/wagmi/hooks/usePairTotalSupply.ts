import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import { useEffect, useMemo } from 'react'
import type { Pair } from '@zenlink-interface/amm'
import { useReadContract } from 'wagmi'
import type { Address } from 'viem'
import { pair as pairContract } from '../abis'
import { useBlockNumber } from './useBlockNumber'

export function usePairTotalSupply(pair: Pair | undefined | null, chainId: ParachainId) {
  const blockNumber = useBlockNumber(chainId)
  const { data: totalSupply, refetch } = useReadContract({
    address: (pair?.liquidityToken.address ?? '') as Address,
    abi: pairContract,
    functionName: 'totalSupply',
    chainId: chainsParachainIdToChainId[chainId],
  })

  useEffect(() => {
    if (pair && blockNumber)
      refetch()
  }, [blockNumber, pair, refetch])

  return useMemo(() => {
    const address = pair?.liquidityToken.address
    if (address && totalSupply) {
      const zlp = new Token({
        address,
        name: 'Zenlink LP Token',
        decimals: 18,
        symbol: 'ZLK-LP',
        chainId,
      })

      return Amount.fromRawAmount(zlp, totalSupply.toString())
    }
  }, [chainId, pair?.liquidityToken.address, totalSupply])
}
