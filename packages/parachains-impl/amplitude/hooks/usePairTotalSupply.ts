import type { Pair } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { Amount } from '@zenlink-interface/currency'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'
import { useApi, useCall } from '@zenlink-interface/polkadot'
import type { ZenlinkAssetBalance, PairStatus as _PairStatus } from '@zenlink-types/bifrost/interfaces'
import { useMemo } from 'react'

interface PairStatus extends Omit<_PairStatus, 'asTrading'> {
  asTrading: {
    totalSupply: ZenlinkAssetBalance
  }
}

export const usePairTotalSupply = (pair: Pair | undefined | null, chainId: ParachainId, enabled = true) => {
  const api = useApi(chainId)
  const pairStatus = useCall<PairStatus>({
    chainId,
    fn: api?.query.zenlinkProtocol.pairStatuses,
    params: pair && enabled
      ? [
          [
            addressToZenlinkAssetId(pair.token0.address),
            addressToZenlinkAssetId(pair.token1.address),
          ],
        ]
      : [],
    options: { enabled: enabled && !!api },
  })

  return useMemo(() => {
    if (!pair || !pairStatus || pairStatus.isDisable || !pairStatus.isTrading)
      return undefined
    return Amount.fromRawAmount(pair.liquidityToken, pairStatus.asTrading.totalSupply.toHex())
  }, [pair, pairStatus])
}
