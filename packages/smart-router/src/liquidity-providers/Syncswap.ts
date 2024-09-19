import type { Token } from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import { BigNumber } from '@ethersproject/bignumber'
import { chainsParachainIdToChainId, ParachainId } from '@zenlink-interface/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import { syncswapStateMulticall } from '../abis'
import { type PoolCode, SyncPool, SyncPoolCode } from '../entities'
import { formatAddress } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class SyncswapProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []

  private unwatchBlockNumber?: () => void

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_ALPHA]: '0xfb39167FE3b148ADd082ca62FBE9413CF5Fa101f',
  }

  public readonly classicFactory: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_ALPHA]: '0x46c8dc568ED604bB18C066Fc8d387859b7977836',
  }

  public readonly stableFactory: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_ALPHA]: '0x441B24fc497317767a9D293931A33939953F251f',
  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async getPools(tokens: Token[]) {
    if (!(this.chainId in this.stateMultiCall)) {
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

    const pools: [Token, Token][] = []
    for (let i = 0; i < tokens.length; ++i) {
      const t0 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t1 = tokens[j]
        pools.push([t0, t1])
      }
    }

    const poolState = await this.client.multicall({
      allowFailure: true,
      contracts: pools.map(
        pool =>
          ({
            args: [
              this.classicFactory[this.chainId] as Address,
              this.stableFactory[this.chainId] as Address,
              pool[0].address as Address,
              pool[1].address as Address,
            ],
            address: this.stateMultiCall[this.chainId] as Address,
            chainId: chainsParachainIdToChainId[this.chainId],
            abi: syncswapStateMulticall,
            functionName: 'getFullState',
          } as const),
      ),
    }).catch((e) => {
      console.warn(e.message)
      return undefined
    })

    poolState?.forEach((states, i) => {
      if (states.status !== 'success' || !states.result)
        return

      states.result.forEach((state) => {
        const reserve0 = BigNumber.from(state.reserve0)
        const reserve1 = BigNumber.from(state.reserve1)
        const swapFee = state.swapFee / 1e5

        const syncPool = new SyncPool(
          state.pool,
          pools[i][0],
          pools[i][1],
          swapFee,
          reserve0,
          reserve1,
          state.isStable,
        )

        const pc = new SyncPoolCode(syncPool, this.getPoolProviderName())
        this.poolCodes.push(pc)
        ++this.stateId
      })
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
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.unwatchBlockNumber = this.client.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
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

  public getType(): LiquidityProviders {
    return LiquidityProviders.Syncswap
  }

  public getPoolProviderName(): string {
    return 'Syncswap'
  }
}
