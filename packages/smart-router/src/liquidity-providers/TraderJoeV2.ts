import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address, PublicClient } from 'viem'
import type { Token } from '@zenlink-interface/currency'
import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import { traderjoeV2StateMulticall } from '../abis'
import type { JoeV2Bin, PoolCode } from '../entities'
import { JoeV2Pool, JoeV2PoolCode } from '../entities'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class TraderJoeV2Provider extends LiquidityProvider {
  public readonly BIN_AMOUNT = 12
  public poolCodes: PoolCode[] = []
  private unwatchBlockNumber?: () => void

  public readonly factory: { [chainId: number]: Address } = {
    [ParachainId.ARBITRUM_ONE]: '0x8e42f2F4101563bF679975178e880FD87d3eFd4e',
  }

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.ARBITRUM_ONE]: '0x4A7Dc8a7f62c46353dF2529c0789cF83C0e0e016',
  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async getPools(tokens: Token[]) {
    if (!(this.chainId in this.factory) || !(this.chainId in this.stateMultiCall)) {
      this.lastUpdateBlock = -1
      return
    }

    // tokens deduplication
    const tokenMap = new Map<string, Token>()
    tokens.forEach(t => tokenMap.set(t.address.toLocaleLowerCase().substring(2).padStart(40, '0'), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map(t => [
      t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
      t,
    ])
    tokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const pools: [Token, Token][] = []
    for (let i = 0; i < tokens.length; ++i) {
      const t0 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t1 = tokens[j]
        pools.push([t0, t1])
      }
    }

    const poolState = await this.client
      .multicall({
        allowFailure: true,
        contracts: pools.map(
          pool =>
            ({
              args: [
                this.factory[this.chainId] as Address,
                pool[0].address as Address,
                pool[1].address as Address,
                BigInt(this.BIN_AMOUNT),
                BigInt(this.BIN_AMOUNT),
              ],
              address: this.stateMultiCall[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: traderjoeV2StateMulticall,
              functionName: 'getFullState',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(e.message)
        return undefined
      })

    pools.forEach((pool, i) => {
      if (poolState?.[i].status !== 'success' || !poolState?.[i].result)
        return

      poolState[i].result?.forEach((res) => {
        const totalFee = BigNumber.from(res.totalFee).toNumber()
        const bins: JoeV2Bin[] = res.binInfos.map(bin => ({
          id: bin.id,
          reserve0: BigNumber.from(bin.reserveX),
          reserve1: BigNumber.from(bin.reserveY),
        }))

        const joev2Pool = new JoeV2Pool(
          res.pair,
          pool[0] as BaseToken,
          pool[1] as BaseToken,
          totalFee / 1e18,
          BigNumber.from(res.reserve0),
          BigNumber.from(res.reserve1),
          totalFee,
          res.binStep,
          res.activeId,
          bins,
        )

        const pc = new JoeV2PoolCode(joev2Pool, this.getPoolProviderName())
        this.poolCodes.push(pc)
        ++this.stateId
      })
    })
  }

  public async updatePoolsData() {
    if (!this.poolCodes.length)
      return

    const poolAddr = new Map<string, JoeV2Pool>()
    this.poolCodes.forEach(p => poolAddr.set(p.pool.address, p.pool as JoeV2Pool))
    const pools = this.poolCodes.map(p => [p.pool.token0, p.pool.token1])

    const poolState = await this.client
      .multicall({
        allowFailure: true,
        contracts: pools.map(
          pool =>
            ({
              args: [
                this.factory[this.chainId] as Address,
                pool[0].address as Address,
                pool[1].address as Address,
                BigInt(this.BIN_AMOUNT),
                BigInt(this.BIN_AMOUNT),
              ],
              address: this.stateMultiCall[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: traderjoeV2StateMulticall,
              functionName: 'getFullState',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(e.message)
        return undefined
      })

    pools.forEach((_, i) => {
      if (poolState?.[i].status !== 'success' || !poolState?.[i].result)
        return

      poolState[i].result?.forEach((res) => {
        const bins: JoeV2Bin[] = res.binInfos.map(bin => ({
          id: bin.id,
          reserve0: BigNumber.from(bin.reserveX),
          reserve1: BigNumber.from(bin.reserveY),
        }))

        const joev2Pool = poolAddr.get(res.pair)
        if (joev2Pool) {
          joev2Pool.updateState(
            BigNumber.from(res.reserve0),
            BigNumber.from(res.reserve1),
            res.activeId,
            bins,
          )
          ++this.stateId
        }
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

  public getType(): LiquidityProviders {
    return LiquidityProviders.TraderJoeV2
  }

  public getPoolProviderName(): string {
    return 'TraderJoeV2'
  }
}
