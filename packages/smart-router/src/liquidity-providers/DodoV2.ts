import type { BaseToken } from '@zenlink-interface/amm'
import type { Address, PublicClient } from 'viem'
import type { PoolCode } from '../entities'
import { BigNumber } from '@ethersproject/bignumber'
import { chainsParachainIdToChainId, ParachainId } from '@zenlink-interface/chain'
import { Token, WNATIVE } from '@zenlink-interface/currency'
import { dodoV2StateMulticall } from '../abis'
import { DodoV2Pool, DodoV2PoolCode } from '../entities'
import { getNumber } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class DodoV2Provider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []

  private unwatchBlockNumber?: () => void

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_ALPHA]: '0xc093DAf4ECFce49Cc1d726bED4343A7416dc5A51',
  }

  public readonly DVMfactory: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_ALPHA]: '0x0b96b88B1941C3Df77b5A065dD3075fDB7986301',
  }

  private readonly tokenGroupMap: { [chainId: number]: [Token, Token][] } = {
    [ParachainId.SCROLL_ALPHA]: [
      [
        WNATIVE[ParachainId.SCROLL_ALPHA],
        new Token({
          chainId: ParachainId.SCROLL_ALPHA,
          address: '0xDf40f3a3566b4271450083f1Ad5732590BA47575',
          symbol: 'EURS',
          name: 'EURS',
          decimals: 2,
        }),
      ],
    ],
  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async getPools(tokenGroup: [Token, Token][]) {
    if (!(this.chainId in this.stateMultiCall)) {
      this.lastUpdateBlock = -1
      return
    }

    const DVMPoolStates = this.chainId in this.DVMfactory
      ? await this.client.multicall({
        allowFailure: true,
        contracts: tokenGroup.map(
          ([token0, token1]) => ({
            args: [
              this.DVMfactory[this.chainId] as Address,
              token0.address as Address,
              token1.address as Address,
            ],
            address: this.stateMultiCall[this.chainId] as Address,
            chainId: chainsParachainIdToChainId[this.chainId],
            abi: dodoV2StateMulticall,
            functionName: 'getFullState',
          }),
        ),
      })
      : undefined

    tokenGroup.forEach((group, i) => {
      const poolState = DVMPoolStates?.[i]
      if (poolState?.status !== 'success' || !poolState.result)
        return

      poolState.result.forEach((res) => {
        const reserve0 = BigNumber.from(res.reserve0)
        const reserve1 = BigNumber.from(res.reserve1)
        if (reserve0.eq(0) || reserve1.eq(0))
          return

        const [token0, token1] = group[0].address.toLowerCase() === res.token0
          ? [group[0], group[1]]
          : [group[1], group[0]]

        const dodov2pool = new DodoV2Pool(
          res.pool,
          token0 as BaseToken,
          token1 as BaseToken,
          getNumber(res.lpFeeRate) / 1e18,
          BigNumber.from(res.reserve0),
          BigNumber.from(res.reserve1),
          {
            i: getNumber(res.state.i),
            K: getNumber(res.state.K),
            B: getNumber(res.state.B),
            Q: getNumber(res.state.Q),
            B0: getNumber(res.state.B0),
            Q0: getNumber(res.state.Q0),
            R: res.state.R,
          },
          BigNumber.from(res.lpFeeRate),
          BigNumber.from(res.mtFeeRate),
          BigNumber.from(res.midPrice),
        )

        const pc = new DodoV2PoolCode(dodov2pool, this.getPoolProviderName())
        this.poolCodes.push(pc)
        ++this.stateId
      })
    })
  }

  private _getProspectiveTokens(t0: Token, t1: Token): [Token, Token][] {
    if (!(this.chainId in this.tokenGroupMap))
      return []
    const tokenGroup = this.tokenGroupMap[this.chainId]
    return tokenGroup.filter(group =>
      group[0].address.toLowerCase() === t0.address.toLowerCase()
      || group[0].address.toLowerCase() === t1.address.toLowerCase()
      || group[1].address.toLowerCase() === t0.address.toLowerCase()
      || group[1].address.toLowerCase() === t1.address.toLowerCase(),
    )
  }

  public startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.poolCodes = []
    if (!(this.chainId in this.tokenGroupMap))
      return
    this.getPools(this.tokenGroupMap[this.chainId]) // starting the process
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
    return LiquidityProviders.DODOV2
  }

  public getPoolProviderName(): string {
    return 'DODOV2'
  }
}
