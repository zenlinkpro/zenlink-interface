import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { useMemo } from 'react'

import type { ChainTokenMap } from '../types'

export function useTokensFromMap(chainId: ParachainId | undefined, tokenMap: ChainTokenMap): Record<string, Token> {
  return useMemo(() => {
    if (!chainId)
      return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token
        return newMap
      },
      {},
    )

    return mapWithoutUrls
  }, [chainId, tokenMap])
}
