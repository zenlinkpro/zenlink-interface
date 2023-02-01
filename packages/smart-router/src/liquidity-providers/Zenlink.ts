import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import type { ethers } from 'ethers'
import type { Limited } from '../entities'
import type { MultiCallProvider } from '../MultiCallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ZenlinkProvider extends UniswapV2BaseProvider {
  factory = FACTORY_ADDRESS
  initCodeHash = INIT_CODE_HASH

  public constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ParachainId,
    l: Limited,
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.Zenlink
  }

  public getPoolProviderName(): string {
    return 'Zenlink'
  }
}
