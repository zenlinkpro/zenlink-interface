import type { ParachainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import type { BigNumber, ethers } from 'ethers'
import type { StableSwap as StableSwapContract } from '@zenlink-dex/zenlink-evm-contracts'
import JSBI from 'jsbi'
import { StableSwap } from '@zenlink-interface/amm'
import type { Limited, PoolCode } from '../entities'
import { MetaPool, MetaPoolCode, StablePool, StablePoolCode } from '../entities'
import type { MultiCallProvider } from '../MultiCallProvider'
import { convertToBigNumber } from '../MultiCallProvider'
import { LiquidityProvider } from './LiquidityProvider'

const getTokenBalanceABI = [
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'index',
        type: 'uint8',
      },
    ],
    name: 'getTokenBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const swapStorageABI = [
  {
    inputs: [],
    name: 'swapStorage',
    outputs: [
      {
        internalType: 'uint256',
        name: 'initialA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'futureA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'initialATime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'futureATime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'swapFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'adminFee',
        type: 'uint256',
      },
      {
        internalType: 'contract LPToken',
        name: 'lpToken',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getAABI = [
  {
    inputs: [],
    name: 'getA',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getVirtualPriceABI = [
  {
    inputs: [],
    name: 'getVirtualPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const totalSupplyABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export abstract class SaddleBaseProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []
  public readonly fee = 0.0004
  // [basePool, tokens, baseLP]
  public abstract basePools: { [chainId: number]: [string, string[], string][] }
  // [metaPool, tokens, metaLP, basePool]
  public abstract metaPools: { [chainId: number]: [string, string[], string, string][] }
  public fetchedTokens: Set<Token> = new Set()
  private blockListener?: () => void

  public constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ParachainId,
    l: Limited,
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
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

    // if it is the first obtained pool list
    if (this.lastUpdateBlock === 0)
      this.lastUpdateBlock = this.multiCallProvider.lastCallBlockNumber
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
      poolAddresses.map((address, i) => this.multiCallProvider.multiDataCall(
        address,
        getTokenBalanceABI,
        'getTokenBalance',
        tokensAddresses[i].map((_, index) => [index]),
      )),
    )
    const swapStoragePromise = this.multiCallProvider.multiContractCall(
      poolAddresses,
      swapStorageABI,
      'swapStorage',
      [],
    )
    const getAPromise = this.multiCallProvider.multiContractCall(
      poolAddresses,
      getAABI,
      'getA',
      [],
    )
    const getVirtualPricePromise = this.multiCallProvider.multiContractCall(
      poolAddresses,
      getVirtualPriceABI,
      'getVirtualPrice',
      [],
    )

    const totalSupplysPromise = this.multiCallProvider.multiContractCall(
      lpAddresses,
      totalSupplyABI,
      'totalSupply',
      [],
    )

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
      const tokens = tokensAddresses[i] as Awaited<ReturnType<StableSwapContract['getTokens']>>
      const balances = tokenBalances[i].map(b => convertToBigNumber(b[0]).toString()) as string[]
      const storage = swapStorage[i]
      const a = A[i][0] as Awaited<ReturnType<StableSwapContract['getA']>>
      const virtualPrice = virtualPrices[i][0] as Awaited<ReturnType<StableSwapContract['getVirtualPrice']>>
      const totalSupply = totalSupplys[i][0] as BigNumber

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
          Amount.fromRawAmount(liquidityToken, convertToBigNumber(totalSupply).toString()),
          balances.map((balance, i) => Amount.fromRawAmount(pooledTokens[i], balance)),
          JSBI.BigInt(convertToBigNumber(storage[4]).toString()),
          JSBI.BigInt(convertToBigNumber(storage[5]).toString()),
          JSBI.BigInt(convertToBigNumber(a).toString()),
          JSBI.BigInt(convertToBigNumber(virtualPrice).toString()),
        )

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
                    const basePool = new StablePool(swap, pooledTokens[i], pooledTokens[j], this.fee)
                    poolCodes.push(new StablePoolCode(basePool, this.getPoolProviderName()))
                    ++this.stateId
                  }
                }
              }
              for (let i = 0; i < tokensLengthExcludeLP; i++) {
                for (let j = 0; j < basePooledTokens.length; j++) {
                  const metaPool = new MetaPool(baseSwap, swap, pooledTokens[i], basePooledTokens[j], this.fee)
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
                const pool = new StablePool(swap, pooledTokens[i], pooledTokens[j], this.fee)
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
    this.blockListener = () => {
      this.updatePoolsData()
    }
    this.chainDataProvider.on('block', this.blockListener)
  }

  public fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {
    if (this.blockListener)
      this.chainDataProvider.off('block', this.blockListener)
    this.blockListener = undefined
  }
}
