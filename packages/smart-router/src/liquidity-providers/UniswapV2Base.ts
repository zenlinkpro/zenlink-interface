import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { keccak256, pack } from '@ethersproject/solidity'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import type { BaseToken } from '@zenlink-interface/amm'
import { type Address, type PublicClient, getCreate2Address } from 'viem'
import { BigNumber } from '@ethersproject/bignumber'
import type { BasePool, PoolCode } from '../entities'
import { StandardPool, StandardPoolCode } from '../entities'
import { formatAddress } from '../util'
import { LiquidityProvider } from './LiquidityProvider'

const getReservesAbi = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: '_reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: '_reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: '_blockTimestampLast',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  public readonly fetchedPools: Map<string, number> = new Map()
  public poolCodes: PoolCode[] = []
  public readonly fee = 0.003
  public abstract factory: { [chainId: number]: string }
  public abstract initCodeHash: { [chainId: number]: string }
  private unwatchBlockNumber?: () => void

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async getPools(tokens: Token[]) {
    if (!(this.chainId in this.factory)) {
      this.lastUpdateBlock = -1
      return
    }

    // tokens deduplication
    const tokenMap = new Map<string, Token>()
    tokens.forEach(t => tokenMap.set(formatAddress(t.address), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map(t => [formatAddress(t.address), t])
    tokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const poolAddr: Map<string, [Token, Token]> = new Map()
    for (let i = 0; i < tokens.length; ++i) {
      const t0 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t1 = tokens[j]

        const addr = this._getPoolAddress(t0, t1)
        poolAddr.set(addr, [t0, t1])
        if (this.fetchedPools.get(addr) === undefined)
          this.fetchedPools.set(addr, 1)
      }
    }

    const addrs = Array.from(poolAddr.keys())

    const results = await this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: addrs.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: getReservesAbi,
        functionName: 'getReserves',
      } as const)),
    }).catch((e) => {
      console.warn(`${e.message}`)
      return undefined
    })

    addrs.forEach((addr, i) => {
      const res0 = results?.[i]?.result?.[0]
      const res1 = results?.[i]?.result?.[1]

      if (res0 && res1) {
        const toks = poolAddr.get(addr) as [Token, Token]
        const pool = new StandardPool(
          addr,
          toks[0] as BaseToken,
          toks[1] as BaseToken,
          this.fee,
          BigNumber.from(res0),
          BigNumber.from(res1),
        )
        const pc = new StandardPoolCode(pool, this.getPoolProviderName())
        this.poolCodes.push(pc)
        ++this.stateId
      }
    })
  }

  public async updatePoolsData() {
    if (!this.poolCodes.length)
      return

    const poolAddr = new Map<string, BasePool>()
    this.poolCodes.forEach(p => poolAddr.set(p.pool.address, p.pool))
    const addrs = this.poolCodes.map(p => p.pool.address)

    const results = await this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: addrs.map(addr => ({
        address: addr as Address,
        chainId: chainsParachainIdToChainId[this.chainId],
        abi: getReservesAbi,
        functionName: 'getReserves',
      } as const)),
    }).catch((e) => {
      console.warn(`${e.message}`)
      return undefined
    })

    addrs.forEach((addr, i) => {
      const res0 = results?.[i]?.result?.[0]
      const res1 = results?.[i]?.result?.[1]
      if (res0 && res1) {
        const res0BN = BigNumber.from(res0)
        const res1BN = BigNumber.from(res1)
        const pool = poolAddr.get(addr) as BasePool
        if (!res0BN.eq(pool.reserve0) || !res1BN.eq(pool.reserve1)) {
          pool.updateReserves(res0BN, res1BN)
          ++this.stateId
        }
      }
    })
  }

  private _getPoolAddress(t1: Token, t2: Token): string {
    return getCreate2Address({
      from: this.factory[this.chainId] as Address,
      salt: keccak256(['bytes'], [pack(['address', 'address'], [t1.address, t2.address])]) as Address,
      bytecodeHash: this.initCodeHash[this.chainId] as Address,
    })
  }

  private _getProspectiveTokens(t0: Token, t1: Token): Token[] {
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
    this.fetchedPools.clear()
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
