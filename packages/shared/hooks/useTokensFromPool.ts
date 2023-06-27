import { Amount, Native, Token } from '@zenlink-interface/currency'
import type { Type } from '@zenlink-interface/currency'
import type { Pair, Pool, SingleTokenLock, StableSwap } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { useMemo } from 'react'

export interface TokensFromPool {
  tokens: (Token | Type)[]
  liquidityToken: Token
  reserves: Amount<Token>[]
  totalSupply: Amount<Token>
}

export function getTokensFromPair(pair: Pair): TokensFromPool {
  const _token0 = new Token({
    address: pair.token0.id,
    name: pair.token0.name,
    decimals: pair.token0.decimals,
    symbol: pair.token0.symbol,
    chainId: pair.chainId,
  })
  const _token1 = new Token({
    address: pair.token1.id,
    name: pair.token1.name,
    decimals: pair.token1.decimals,
    symbol: pair.token1.symbol,
    chainId: pair.chainId,
  })
  const [token0, token1, liquidityToken] = [
    _token0.wrapped.address === Native.onChain(_token0.chainId).wrapped.address
      ? Native.onChain(_token0.chainId)
      : _token0,
    _token1.wrapped.address === Native.onChain(_token1.chainId).wrapped.address
      ? Native.onChain(_token1.chainId)
      : _token1,
    new Token({
      address: pair.id.includes(':') ? pair.id.split(':')[1] : pair.id,
      name: 'Manta LP Token',
      decimals: 12,
      symbol: 'MLP',
      chainId: pair.chainId,
    }),
  ]
  return {
    tokens: [token0, token1],
    liquidityToken,
    reserves: [
      Amount.fromRawAmount(_token0, pair.reserve0 || 0),
      Amount.fromRawAmount(_token1, pair.reserve1 || 0),
    ],
    totalSupply: Amount.fromRawAmount(liquidityToken, pair.totalSupply || 0),
  }
}

export function getTokensFromStablePool(pool: StableSwap): TokensFromPool {
  const tokens = pool.tokens.map(({ id, name, decimals, symbol, chainId }) =>
    new Token({
      address: id,
      name,
      decimals,
      symbol,
      chainId,
    }),
  )
  const liquidityToken = new Token({
    address: pool.lpToken,
    name: '4pool',
    decimals: 18,
    symbol: '4pool',
    chainId: pool.chainId,
  })

  return {
    tokens,
    liquidityToken,
    reserves: pool.balances.map((balance, i) => Amount.fromRawAmount(tokens[i], balance || 0)),
    totalSupply: Amount.fromRawAmount(liquidityToken, pool.lpTotalSupply || 0),
  }
}

export function getTokensFromSinglePool(pool: SingleTokenLock) {
  const token = new Token({
    address: pool.token.id,
    name: pool.token.name,
    decimals: pool.token.decimals,
    symbol: pool.token.symbol,
    chainId: pool.chainId,
  })
  const tokens = [token]
  const liquidityToken = token

  return {
    tokens,
    liquidityToken,
    reserves: tokens.map(token => Amount.fromRawAmount(token, pool.totalLiquidity)),
    totalSupply: Amount.fromRawAmount(liquidityToken, pool.totalLiquidity),
  }
}

export const useTokensFromPool = (pool: Pool) => {
  return useMemo(() => {
    switch (pool.type) {
      case POOL_TYPE.STANDARD_POOL:
        return getTokensFromPair(pool as Pair)
      case POOL_TYPE.STABLE_POOL:
        return getTokensFromStablePool(pool as StableSwap)
      case POOL_TYPE.SINGLE_TOKEN_POOL:
        return getTokensFromSinglePool(pool as SingleTokenLock)
    }
  }, [pool])
}
