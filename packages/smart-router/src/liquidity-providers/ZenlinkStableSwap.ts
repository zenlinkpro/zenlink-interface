import { ParachainId } from '@zenlink-interface/chain'
import { Amount, Token } from '@zenlink-interface/currency'
import type { BigNumber, ethers } from 'ethers'
import type { StableSwap as StableSwapContract } from '@zenlink-dex/zenlink-evm-contracts'
import { StableSwap } from '@zenlink-interface/amm'
import JSBI from 'jsbi'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import type { Limited, PoolCode } from '../entities'
import { StablePool, StablePoolCode } from '../entities'
import type { MultiCallProvider } from '../MultiCallProvider'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const StablePools: Record<string | number, string[]> = {
  [ParachainId.ASTAR]: [
    '0xb0Fa056fFFb74c0FB215F86D691c94Ed45b686Aa',
  ],
}

const getTokensABI = [
  {
    inputs: [],
    name: 'getTokens',
    outputs: [
      {
        internalType: 'contract IERC20[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getLpTokenABI = [
  {
    inputs: [],
    name: 'getLpToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getTokenBalancesABI = [
  {
    inputs: [],
    name: 'getTokenBalances',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
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
        internalType: 'contract LPToken',
        name: 'lpToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'adminFee',
        type: 'uint256',
      },
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

export class ZenlinkStableSwapProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []
  public readonly fee = 0.0005
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

  public getType(): LiquidityProviders {
    return LiquidityProviders.ZenlinkStableSwap
  }

  public getPoolProviderName(): string {
    return 'ZenlinkStableSwap'
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

    // if it is the first obtained pool list
    if (this.lastUpdateBlock === 0)
      this.lastUpdateBlock = this.multiCallProvider.lastCallBlockNumber
  }

  public async getStablePools(tokens: Token[], needPoolCode = true): Promise<[StableSwap[], PoolCode[]]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokens.forEach((t) => {
      if (!this.fetchedTokens.has(t))
        this.fetchedTokens.add(t)

      tokenMap.set(t.address.toLowerCase(), t)
    })
    const poolAddresses = StablePools[this.chainId] || []

    const poolTokensPromise = this.multiCallProvider.multiContractCall(
      poolAddresses,
      getTokensABI,
      'getTokens',
      [],
    )
    const lpTokenPromise = this.multiCallProvider.multiContractCall(
      poolAddresses,
      getLpTokenABI,
      'getLpToken',
      [],
    )
    const tokenBalancesPromise = this.multiCallProvider.multiContractCall(
      poolAddresses,
      getTokenBalancesABI,
      'getTokenBalances',
      [],
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

    const [
      pooledTokens,
      lpTokens,
      tokenBalances,
      swapStorage,
      A,
      virtualPrices,
    ] = await Promise.all([
      poolTokensPromise,
      lpTokenPromise,
      tokenBalancesPromise,
      swapStoragePromise,
      getAPromise,
      getVirtualPricePromise,
    ])

    const totalSupplys = await this.multiCallProvider.multiContractCall(
      poolAddresses.map((_, i) => lpTokens[i]),
      totalSupplyABI,
      'totalSupply',
      [],
    )

    const poolCodes: PoolCode[] = []
    const stableSwaps: StableSwap[] = []
    poolAddresses.forEach((addr, i) => {
      const tokens = pooledTokens[i] as Awaited<ReturnType<StableSwapContract['getTokens']>>
      const lpToken = lpTokens[i] as Awaited<ReturnType<StableSwapContract['getLpToken']>>
      const balances = tokenBalances[i] as Awaited<ReturnType<StableSwapContract['getTokenBalances']>>
      const storage = swapStorage[i] as Awaited<ReturnType<StableSwapContract['swapStorage']>>
      const a = A[i] as Awaited<ReturnType<StableSwapContract['getA']>>
      const virtualPrice = virtualPrices[i] as Awaited<ReturnType<StableSwapContract['getVirtualPrice']>>
      const totalSupply = totalSupplys[i] as BigNumber

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
        const pooledTokens = tokens.map(address => tokenMap.get(address) as Token)
        const swap = new StableSwap(
          this.chainId,
          addr,
          pooledTokens,
          liquidityToken,
          Amount.fromRawAmount(liquidityToken, totalSupply.toString()),
          tokenBalances.map((balance, i) => Amount.fromRawAmount(pooledTokens[i], balance.toString())),
          JSBI.BigInt(storage.fee.toString()),
          JSBI.BigInt(storage.adminFee.toString()),
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
      ...(ADDITIONAL_BASES[this.chainId][t0.address] || []),
      ...(ADDITIONAL_BASES[this.chainId][t1.address] || []),
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
