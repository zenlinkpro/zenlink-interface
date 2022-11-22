import { Token } from '@zenlink-interface/currency'
import type { Pair, Pool, StableSwap } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { useMemo } from 'react'

export const useTokensFromPool = (pool: Pool) => {
  return useMemo(() => {
    if (pool.type === POOL_TYPE.STANDARD_POOL) {
      const _pool = pool as Pair
      return {
        tokens: [
          new Token({
            address: _pool.token0.id,
            name: _pool.token0.name,
            decimals: Number(_pool.token0.decimals),
            symbol: _pool.token0.symbol,
            chainId: _pool.chainId,
          }),
          new Token({
            address: _pool.token1.id,
            name: _pool.token1.name,
            decimals: Number(_pool.token1.decimals),
            symbol: _pool.token1.symbol,
            chainId: _pool.chainId,
          }),
        ],
        liquidityToken: new Token({
          address: _pool.address,
          name: 'Zenlink LP Token',
          decimals: 18,
          symbol: '4pool',
          chainId: _pool.chainId,
        }),
      }
    }
    else {
      const _pool = pool as StableSwap
      return {
        tokens: _pool.tokens.map(
          ({ id, name, decimals, symbol, chainId }) => new Token({
            address: id,
            name,
            decimals,
            symbol,
            chainId,
          }),
        ),
        liquidityToken: new Token({
          address: _pool.lpToken,
          name: '4pool',
          decimals: 18,
          symbol: '4pool',
          chainId: _pool.chainId,
        }),
      }
    }
  }, [pool])
}
