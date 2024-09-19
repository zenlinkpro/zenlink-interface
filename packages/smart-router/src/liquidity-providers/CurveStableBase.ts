import type { ParachainId } from '@zenlink-interface/chain'
import type { Address, PublicClient } from 'viem'
import type { PoolCode } from '../entities'
import { BigNumber } from '@ethersproject/bignumber'
import { StableSwap } from '@zenlink-interface/amm'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import JSBI from 'jsbi'
import { curveStableBase } from '../abis'
import { CurveMetaPoolCode, CurveStablePoolCode, MetaPool, StablePool } from '../entities'
import { LiquidityProvider } from './LiquidityProvider'

export abstract class CurveStableBaseProvider extends LiquidityProvider {
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
        multicallAddress: this.client.chain?.contracts?.multicall3?.address,
        allowFailure: true,
        contracts: tokensAddresses[i].map((_, index) => ({
          address: address as Address,
          chainId: chainsParachainIdToChainId[this.chainId],
          abi: curveStableBase,
          functionName: 'balances',
          args: [BigInt(index)],
        }) as const),
      })),
    )
    const getAPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: curveStableBase,
        functionName: 'A',
      }) as const),
    })
    const getVirtualPricePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: curveStableBase,
        functionName: 'get_virtual_price',
      }) as const),
    })
    const getSwapFeePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: curveStableBase,
        functionName: 'fee',
      }) as const),
    })
    const getAdminFeePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: curveStableBase,
        functionName: 'admin_fee',
      }) as const),
    })

    const [
      tokenBalances,
      A,
      virtualPrices,
      swapFees,
      adminFees,
    ] = await Promise.all([
      tokenBalancesPromise,
      getAPromise,
      getVirtualPricePromise,
      getSwapFeePromise,
      getAdminFeePromise,
    ])

    const poolCodes: PoolCode[] = []
    const stableSwaps: StableSwap[] = []
    const metaSwaps: StableSwap[] = []
    const baseSwapMap = new Map<string, StableSwap>()

    poolAddresses.forEach((addr, i) => {
      const lpToken = lpAddresses[i]
      const tokens = tokensAddresses[i]
      const balances = tokenBalances[i].map(b => BigNumber.from(b.result).toString())
      const a = BigNumber.from(A[i].result)
      const virtualPrice = BigNumber.from(virtualPrices[i].result)
      const swapFee = BigNumber.from(swapFees[i].result)
      const adminFee = BigNumber.from(adminFees[i].result)

      if (
        tokens
        && lpToken
        && balances
        && a
        && virtualPrice
        && swapFee
        && adminFee
        && tokens.every(addr => tokenMap.get(addr.toLowerCase()) !== undefined)
      ) {
        const liquidityToken = new Token({
          chainId: this.chainId,
          address: lpToken,
          decimals: 18,
          symbol: 'CBL',
          name: 'Curve Based LiquidityToken',
        })
        const pooledTokens = tokens.map(address => tokenMap.get(address.toLowerCase()) as Token)
        const swap = new StableSwap(
          this.chainId,
          addr,
          pooledTokens,
          liquidityToken,
          Amount.fromRawAmount(liquidityToken, 0),
          balances.map((balance, i) => Amount.fromRawAmount(pooledTokens[i], balance)),
          JSBI.BigInt(swapFee.toString()),
          JSBI.BigInt(adminFee.toString()),
          JSBI.BigInt(a.toString()),
          JSBI.BigInt(virtualPrice.toString()),
        )

        const baseSwapAddress = basePoolAddresses[i]
        const fee = swapFee.toNumber() / 1e10
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
                    poolCodes.push(new CurveStablePoolCode(basePool, this.getPoolProviderName()))
                    ++this.stateId
                  }
                }
              }
              for (let i = 0; i < tokensLengthExcludeLP; i++) {
                for (let j = 0; j < basePooledTokens.length; j++) {
                  const metaPool = new MetaPool(baseSwap, swap, pooledTokens[i], basePooledTokens[j], fee)
                  poolCodes.push(new CurveMetaPoolCode(metaPool, this.getPoolProviderName()))
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
                poolCodes.push(new CurveStablePoolCode(pool, this.getPoolProviderName()))
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
