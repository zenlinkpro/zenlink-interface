import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import { StableSwap } from '@zenlink-interface/amm'
import type { Address, PublicClient } from 'viem'
import type { PoolCode } from '../entities'
import { MetaPool, MetaPoolCode, StablePool, StablePoolCode } from '../entities'
import { saddleBase } from '../abis'
import { LiquidityProvider } from './LiquidityProvider'

export abstract class SaddleBaseProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []
  // [basePool, tokens, baseLP]
  public abstract basePools: { [chainId: number]: [string, string[], string][] }
  // [metaPool, tokens, metaLP, basePool]
  public abstract metaPools: { [chainId: number]: [string, string[], string, string][] }
  public fetchedTokens: Set<Token> = new Set()
  private unwatchBlockNumber?: () => void

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async getPools(tokens: Token[]) {
    if (this.basePools[this.chainId] === undefined) {
      this.lastUpdateBlock = -1
      return []
    }

    const [, , poolsStable] = await this.getStablePools(tokens)
    if (poolsStable.length) {
      this.poolCodes = [...this.poolCodes, ...poolsStable]
      ++this.stateId
    }
  }

  public async getStablePools(tokens: Token[], needPoolCode = true): Promise<[StableSwap[], StableSwap[], PoolCode[]]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokens.forEach((t) => {
      if (!this.fetchedTokens.has(t))
        this.fetchedTokens.add(t)

      tokenMap.set(t.address.toLowerCase(), t)
    })
    const allPools = [...(this.basePools[this.chainId] || []), ...(this.metaPools[this.chainId] || [])]
    const [poolAddresses, tokensAddresses, lpAddresses, basePoolAddresses] = allPools.reduce<
      [string[], string[][], string[], (string | undefined)[]]
        >((memo, pool) => {
          const [poolAddress, tokenAddresses, lpAddress, basePoolAddress] = pool
          memo[0].push(poolAddress)
          memo[1].push(tokenAddresses)
          memo[2].push(lpAddress)
          memo[3].push(basePoolAddress)
          return memo
        }, [[], [], [], []])

    const tokenBalancesPromise = Promise.all(
      poolAddresses.map((address, i) => this.client.multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: tokensAddresses[i].map((_, index) => ({
          address: address as Address,
          chainId: chainsParachainIdToChainId[this.chainId],
          abi: saddleBase,
          functionName: 'getTokenBalance',
          args: [index],
        }) as const),
      })),
    )
    const swapStoragePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: saddleBase,
        functionName: 'swapStorage',
      }) as const),
    })
    const getAPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: saddleBase,
        functionName: 'getA',
      }) as const),
    })
    const getVirtualPricePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: saddleBase,
        functionName: 'getVirtualPrice',
      })),
    })
    const totalSupplysPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: lpAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: saddleBase,
        functionName: 'totalSupply',
      }) as const),
    })

    const [
      tokenBalances,
      swapStorage,
      A,
      virtualPrices,
      totalSupplys,
    ] = await Promise.all([
      tokenBalancesPromise,
      swapStoragePromise,
      getAPromise,
      getVirtualPricePromise,
      totalSupplysPromise,
    ])

    const poolCodes: PoolCode[] = []
    const stableSwaps: StableSwap[] = []
    const metaSwaps: StableSwap[] = []
    const baseSwapMap = new Map<string, StableSwap>()

    poolAddresses.forEach((addr, i) => {
      const lpToken = lpAddresses[i]
      const tokens = tokensAddresses[i]
      const balances = tokenBalances[i].map(b => BigNumber.from(b.result).toString())
      const storage = swapStorage[i]?.result
      const a = BigNumber.from(A[i].result)
      const virtualPrice = BigNumber.from(virtualPrices[i].result)
      const totalSupply = BigNumber.from(totalSupplys[i].result)

      if (
        tokens
        && lpToken
        && balances
        && storage
        && a
        && virtualPrice
        && totalSupply
        && tokens.every(addr => tokenMap.get(addr.toLowerCase()) !== undefined)
      ) {
        const liquidityToken = new Token({
          chainId: this.chainId,
          address: lpToken,
          decimals: 18,
          symbol: 'SBL',
          name: 'Saddle Based LiquidityToken',
        })
        const pooledTokens = tokens.map(address => tokenMap.get(address.toLowerCase()) as Token)
        const swap = new StableSwap(
          this.chainId,
          addr,
          pooledTokens,
          liquidityToken,
          Amount.fromRawAmount(liquidityToken, totalSupply.toString()),
          balances.map((balance, i) => Amount.fromRawAmount(pooledTokens[i], balance)),
          JSBI.BigInt(BigNumber.from(storage[4]).toString()),
          JSBI.BigInt(BigNumber.from(storage[5]).toString()),
          JSBI.BigInt(a.toString()),
          JSBI.BigInt(virtualPrice.toString()),
        )

        const fee = Number(storage[4]) / 1e10
        const baseSwapAddress = basePoolAddresses[i]
        if (baseSwapAddress) {
          const baseSwap = baseSwapMap.get(baseSwapAddress.toLowerCase())
          if (baseSwap) {
            metaSwaps.push(swap)
            if (needPoolCode) {
              const basePooledTokens = baseSwap.pooledTokens
              const tokensLengthExcludeLP = swap.pooledTokens.length - 1
              if (tokensLengthExcludeLP > 1) {
                for (let i = 0; i < tokensLengthExcludeLP; i++) {
                  for (let j = i + 1; j < tokensLengthExcludeLP; j++) {
                    const basePool = new StablePool(swap, pooledTokens[i], pooledTokens[j], fee)
                    poolCodes.push(new StablePoolCode(basePool, this.getPoolProviderName()))
                    ++this.stateId
                  }
                }
              }
              for (let i = 0; i < tokensLengthExcludeLP; i++) {
                for (let j = 0; j < basePooledTokens.length; j++) {
                  const metaPool = new MetaPool(baseSwap, swap, pooledTokens[i], basePooledTokens[j], fee)
                  poolCodes.push(new MetaPoolCode(metaPool, this.getPoolProviderName()))
                  ++this.stateId
                }
              }
            }
          }
        }
        else {
          baseSwapMap.set(addr.toLowerCase(), swap)
          stableSwaps.push(swap)
          if (needPoolCode) {
            for (let i = 0; i < pooledTokens.length; i++) {
              for (let j = i + 1; j < pooledTokens.length; j++) {
                const pool = new StablePool(swap, pooledTokens[i], pooledTokens[j], fee)
                poolCodes.push(new StablePoolCode(pool, this.getPoolProviderName()))
                ++this.stateId
              }
            }
          }
        }
      }
    })

    return [stableSwaps, metaSwaps, poolCodes]
  }

  public async updatePoolsData() {
    if (!this.poolCodes.length)
      return
    const pools = this.poolCodes.map(pc => pc.pool) as (StablePool | MetaPool)[]

    const [stableSwaps, metaSwaps] = await this.getStablePools(Array.from(this.fetchedTokens), false)
    const swapMap: Map<string, StableSwap> = new Map()
    const swaps = [...stableSwaps, ...metaSwaps]
    swaps.forEach((swap) => {
      swapMap.set(swap.contractAddress, swap)
    })
    pools.forEach((pool) => {
      if (pool instanceof StablePool) {
        const swap = swapMap.get(pool.swap.contractAddress)
        if (swap) {
          pool.updateSwap(swap)
          ++this.stateId
        }
      }
      else {
        const baseSwap = swapMap.get(pool.baseSwap.contractAddress)
        const metaSwap = swapMap.get(pool.metaSwap.contractAddress)
        if (metaSwap && baseSwap) {
          pool.updateSwap(baseSwap, metaSwap)
          ++this.stateId
        }
      }
    })
  }

  public _getProspectiveTokens(t0: Token, t1: Token) {
    const set = new Set<Token>([
      t0,
      t1,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId],
      ...(ADDITIONAL_BASES[this.chainId]?.[t0.address] || []),
      ...(ADDITIONAL_BASES[this.chainId]?.[t1.address] || []),
    ])
    return Array.from(set)
  }

  public startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.poolCodes = []
    this.fetchedTokens.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.unwatchBlockNumber = this.client.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
        this.updatePoolsData()
      },
      onError: (error) => {
        console.error(error.message)
      },
    })
  }

  public async fetchPoolsForToken(t0: Token, t1: Token): Promise<void> {
    await this.getPools(this._getProspectiveTokens(t0, t1))
  }

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {
    if (this.unwatchBlockNumber)
      this.unwatchBlockNumber()
  }
}
