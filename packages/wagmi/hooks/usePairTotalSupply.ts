import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import IPairArtifact from '@zenlink-dex/zenlink-evm-contracts/abi/Pair.json'
import { useMemo } from 'react'
import { useContractRead } from 'wagmi'
import type { Pair } from '@zenlink-interface/amm'

export const usePairTotalSupply = (pair: Pair | undefined | null, chainId: ParachainId) => {
  const { data: totalSupply } = useContractRead({
    address: pair?.liquidityToken.address ?? '',
    abi: IPairArtifact,
    functionName: 'totalSupply',
    chainId: chainsParachainIdToChainId[chainId],
  })

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
