import { Amount, Native, Token } from '@zenlink-interface/currency'
import type { Pair, Pool, SingleTokenLock, StableSwap } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { useMemo } from 'react'

export const useTokensFromPool = (pool: Pool) => {
  return useMemo(() => {
    if (pool.type === POOL_TYPE.STANDARD_POOL) {
      const _pool = pool as Pair
      const _token0 = new Token({
        address: _pool.token0.id,
        name: _pool.token0.name,
        decimals: Number(_pool.token0.decimals),
        symbol: _pool.token0.symbol,
        chainId: _pool.chainId,
      })
      const _token1 = new Token({
        address: _pool.token1.id,
        name: _pool.token1.name,
        decimals: Number(_pool.token1.decimals),
        symbol: _pool.token1.symbol,
        chainId: _pool.chainId,
      })
      const [token0, token1, liquidityToken] = [
        _token0.wrapped.address === Native.onChain(_token0.chainId).wrapped.address
          ? Native.onChain(_token0.chainId)
          : _token0,
        _token1.wrapped.address === Native.onChain(_token1.chainId).wrapped.address
          ? Native.onChain(_token1.chainId)
          : _token1,
        new Token({
          address: _pool.id.includes(':') ? _pool.id.split(':')[1] : _pool.id,
          name: 'Zenlink LP Token',
          decimals: 18,
          symbol: 'ZLP',
          chainId: _pool.chainId,
        }),
      ]

      return {
        tokens: [token0, token1],
        liquidityToken,
        reserves: [
          Amount.fromRawAmount(_token0, _pool.reserve0 || 0),
          Amount.fromRawAmount(_token1, _pool.reserve1 || 0),
        ],
        totalSupply: Amount.fromRawAmount(liquidityToken, _pool.totalSupply || 0),
      }
    }
    else if (pool.type === POOL_TYPE.STABLE_POOL) {
      const _pool = pool as StableSwap
      const tokens = _pool.tokens.map(({ id, name, decimals, symbol, chainId }) =>
        new Token({
          address: id,
          name,
          decimals,
          symbol,
          chainId,
        }),
      )
      const liquidityToken = new Token({
        address: _pool.lpToken,
        name: '4pool',
        decimals: 18,
        symbol: '4pool',
        chainId: _pool.chainId,
      })

      return {
        tokens,
        liquidityToken,
        reserves: _pool.balances.map((balance, i) => Amount.fromRawAmount(tokens[i], balance || 0)),
        totalSupply: Amount.fromRawAmount(liquidityToken, _pool.lpTotalSupply || 0),
      }
    }
    else if (pool.type === POOL_TYPE.SINGLE_TOKEN_POOL) {
      const _pool = pool as SingleTokenLock
      const token = new Token({
        address: _pool.token.id,
        name: _pool.token.name,
        decimals: _pool.token.decimals,
        symbol: _pool.token.symbol,
        chainId: _pool.chainId,
      })
      const tokens = [token]
      const liquidityToken = token
      const reserves = [_pool.totalLiquidity]
      const totalSupply = _pool.totalLiquidity

      return {
        tokens,
        liquidityToken,
        reserves: tokens.map((token, i) => Amount.fromRawAmount(token, reserves[i] || 0)),
        totalSupply: Amount.fromRawAmount(liquidityToken, totalSupply || 0),
      }
    }
    else {
      const _pool = pool as SingleTokenLock
      const token = new Token({
        address: _pool.token.id,
        name: _pool.token.name,
        decimals: _pool.token.decimals,
        symbol: _pool.token.symbol,
        chainId: _pool.chainId,
      })
      const tokens = [token]
      const liquidityToken = token

      return {
        tokens,
        liquidityToken,
        reserves: tokens.map(token => Amount.fromRawAmount(token, 0)),
        totalSupply: Amount.fromRawAmount(liquidityToken, 0 || 0),
      }
    }
  }, [pool])
}
