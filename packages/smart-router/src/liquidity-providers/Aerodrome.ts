import type { Token } from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import { BigNumber } from '@ethersproject/bignumber'
import { chainsParachainIdToChainId, ParachainId } from '@zenlink-interface/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import { velodromeV2StateMulticall } from '../abis'
import { type PoolCode, SolidlyPool, VelodromeV2PoolCode } from '../entities'
import { formatAddress } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class AerodromeProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []

  private unwatchBlockNumber?: () => void

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.BASE]: '0xAFCCA0f68e0883b797c71525377DE46B2E65AB28',
  }

  public readonly factory: { [chainId: number]: Address } = {
    [ParachainId.BASE]: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
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
              this.factory[this.chainId] as Address,
              pool[0].address as Address,
              pool[1].address as Address,
            ],
            address: this.stateMultiCall[this.chainId] as Address,
            chainId: chainsParachainIdToChainId[this.chainId],
            abi: velodromeV2StateMulticall,
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
        const swapFee = Number(state.swapFee) / 1e4

        const solidlyPool = new SolidlyPool(
          state.pool,
          pools[i][0],
          pools[i][1],
          swapFee,
          reserve0,
          reserve1,
          state.isStable,
        )

        const pc = new VelodromeV2PoolCode(solidlyPool, this.getPoolProviderName())
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
    return LiquidityProviders.Aerodrome
  }

  public getPoolProviderName(): string {
    return 'Aerodrome'
  }
}
