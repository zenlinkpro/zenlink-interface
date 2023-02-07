import type { ParachainId } from '@zenlink-interface/chain'
import { Native, WNATIVE, WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import type { ethers } from 'ethers'
import { CommandCode } from '../CommandCode'
import type { BaseToken, Limited, RouteLeg } from '../entities'
import { NatvieWrapPool, PoolCode } from '../entities'
import { HEXer } from '../HEXer'
import type { MultiCallProvider } from '../MultiCallProvider'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class NativeWrapBridgePoolCode extends PoolCode {
  public constructor(pool: NatvieWrapPool) {
    super(pool, 'Wrap Native')
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg): string {
    if (leg.tokenFrom.tokenId === this.pool.token0.tokenId) {
      // wrap - deposit. not used normally
      // wrapAndDistributeERC20Amounts
      const code = new HEXer()
        .uint8(CommandCode.WRAP_AND_DISTRIBUTE_ERC20_AMOUNTS)
        .address(this.pool.address)
        .uint8(0)
        .toString()
      return code
    }
    else {
      // unwrap - withdraw
      // unwrapNative(address receiver, unwrap token)
      const code = new HEXer()
        .uint8(CommandCode.UNWRAP_NATIVE)
        .address(this.pool.address)
        .toString()
      return code
    }
  }
}

export class NativeWrapProvider extends LiquidityProvider {
  public poolCodes: PoolCode[]

  public constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ParachainId,
    l: Limited,
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
    const native = Native.onChain(chainId)
    const nativeToken: BaseToken = {
      address: '',
      name: native.name,
      symbol: native.symbol,
      chainId,
    }
    const bridge = new NatvieWrapPool(
      WNATIVE_ADDRESS[chainId],
      nativeToken,
      WNATIVE[chainId] as BaseToken,
      0,
      50_000,
    )
    this.poolCodes = [new NativeWrapBridgePoolCode(bridge)]
    this.stateId = 0
    this.lastUpdateBlock = -1
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.NativeWrap
  }

  public getPoolProviderName(): string {
    return 'NativeWrap'
  }

  public startFetchPoolsData() {}

  public fetchPoolsForToken(): void {}

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {}
}
