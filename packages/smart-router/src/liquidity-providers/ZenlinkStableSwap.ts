import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import { BigNumber } from 'ethers'
import { StableSwap } from '@zenlink-interface/amm'
import JSBI from 'jsbi'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import type { Address, PublicClient } from 'viem'
import type { PoolCode } from '../entities'
import { StablePool, StablePoolCode } from '../entities'
import { zenlinkStableSwap } from '../abis'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const StablePools: Record<string | number, [string, string][]> = {
  [ParachainId.ASTAR]: [
    // [4pool, lp]
    ['0xb0Fa056fFFb74c0FB215F86D691c94Ed45b686Aa', '0x755cbAC2246e8219e720591Dd362a772076ab653'],
  ],
}

export class ZenlinkStableSwapProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []
  public readonly fee = 0.0005
  public fetchedTokens: Set<Token> = new Set()
  private unwatchBlockNumber?: () => void

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.ZenlinkStableSwap
  }

  public getPoolProviderName(): string {
    return 'Zenlink'
  }

  public async getPools(tokens: Token[]) {
    if (StablePools[this.chainId] === undefined) {
      this.lastUpdateBlock = -1
      return []
    }

    const [, poolsStable] = await this.getStablePools(tokens)
    if (poolsStable.length) {
      this.poolCodes = [...this.poolCodes, ...poolsStable]
      ++this.stateId
    }
  }

  public async getStablePools(tokens: Token[], needPoolCode = true): Promise<[StableSwap[], PoolCode[]]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokens.forEach((t) => {
      if (!this.fetchedTokens.has(t))
        this.fetchedTokens.add(t)

      tokenMap.set(t.address.toLowerCase(), t)
    })
    const [poolAddresses, lpAddresses] = StablePools[this.chainId]?.reduce<
      [string[], string[]]
    >((memo, pool) => {
      const [poolAddress, lpAddress] = pool
      memo[0].push(poolAddress)
      memo[1].push(lpAddress)
      return memo
    }, [[], []]) || []

    const poolTokensPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: zenlinkStableSwap,
        functionName: 'getTokens',
      })),
    })
    const tokenBalancesPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: zenlinkStableSwap,
        functionName: 'getTokenBalances',
      })),
    })
    const swapStoragePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: zenlinkStableSwap,
        functionName: 'swapStorage',
      })),
    })
    const getAPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: zenlinkStableSwap,
        functionName: 'getA',
      })),
    })
    const getVirtualPricePromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: zenlinkStableSwap,
        functionName: 'getVirtualPrice',
      })),
    })

    const totalSupplysPromise = this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: lpAddresses.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: zenlinkStableSwap,
        functionName: 'totalSupply',
      })),
    })

    const [
      pooledTokens,
      tokenBalances,
      swapStorage,
      A,
      virtualPrices,
      totalSupplys,
    ] = await Promise.all([
      poolTokensPromise,
      tokenBalancesPromise,
      swapStoragePromise,
      getAPromise,
      getVirtualPricePromise,
      totalSupplysPromise,
    ])

    const poolCodes: PoolCode[] = []
    const stableSwaps: StableSwap[] = []
    poolAddresses.forEach((addr, i) => {
      const lpToken = lpAddresses[i]
      const tokens = pooledTokens[i]?.result
      const balances = tokenBalances[i]?.result
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
          symbol: '',
          name: '',
        })
        const pooledTokens = tokens.map(address => tokenMap.get(address.toLowerCase()) as Token)
        const swap = new StableSwap(
          this.chainId,
          addr,
          pooledTokens,
          liquidityToken,
          Amount.fromRawAmount(liquidityToken, totalSupply.toString()),
          balances.map((balance, i) => Amount.fromRawAmount(pooledTokens[i], BigNumber.from(balance).toString())),
          JSBI.BigInt(BigNumber.from(storage[1]).toString()),
          JSBI.BigInt(BigNumber.from(storage[2]).toString()),
          JSBI.BigInt(a.toString()),
          JSBI.BigInt(virtualPrice.toString()),
        )
        stableSwaps.push(swap)
        if (needPoolCode) {
          for (let i = 0; i < pooledTokens.length; i++) {
            for (let j = i + 1; j < pooledTokens.length; j++) {
              const pool = new StablePool(swap, pooledTokens[i], pooledTokens[j], this.fee)
              poolCodes.push(new StablePoolCode(pool, this.getPoolProviderName()))
              ++this.stateId
            }
          }
        }
      }
    })

    return [stableSwaps, poolCodes]
  }

  public async updatePoolsData() {
    if (!this.poolCodes.length)
      return
    const pools = this.poolCodes.map(pc => pc.pool).filter(p => p instanceof StablePool) as StablePool[]

    const [stableSwaps] = await this.getStablePools(Array.from(this.fetchedTokens), false)
    const stableSwapMap: Map<string, StableSwap> = new Map()
    stableSwaps.forEach((swap) => {
      stableSwapMap.set(swap.contractAddress, swap)
    })
    pools.forEach((pool) => {
      const swap = stableSwapMap.get(pool.swap.contractAddress)
      if (swap) {
        pool.updateSwap(swap)
        ++this.stateId
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
