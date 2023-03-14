import type { Address, PublicClient } from 'viem'
import { add, getUnixTime } from 'date-fns'
import type { ParachainId } from '@zenlink-interface/chain'
import type { PoolCode } from '../entities'
import { LiquidityProvider } from './LiquidityProvider'

interface PoolInfo {
  poolCode: PoolCode
  validUntilTimestamp: number
}

export abstract class UniswapV3BaseProvider extends LiquidityProvider {
  public readonly TOP_POOL_SIZE = 1
  public readonly TOP_POOL_LIQUIDITY_THRESHOLD = 5000
  public readonly ON_DEMAND_POOL_SIZE = 20
  public readonly REFRESH_INITIAL_POOLS_INTERVAL = 60 // SECONDS
  public readonly BIT_AMOUNT = 12

  public readonly initialPools: Map<string, PoolCode> = new Map()
  public readonly poolsByTrade: Map<string, string[]> = new Map()
  public readonly onDemandPools: Map<string, PoolInfo> = new Map()

  private unwatchBlockNumber?: () => void

  public isInitialized = false
  public readonly factory: { [chainId: number]: Address } = {}
  public readonly stateMultiCall: { [chainId: number]: Address } = {}
  public readonly refreshInitialPoolsTimestamp = getUnixTime(
    add(Date.now(), { seconds: this.REFRESH_INITIAL_POOLS_INTERVAL }),
  )

  public constructor(
    chainId: ParachainId,
    client: PublicClient,
    factory: { [chainId: number]: Address },
    stateMultiCall: { [chainId: number]: Address },
  ) {
    super(chainId, client)
    this.factory = factory
    this.stateMultiCall = stateMultiCall
    if (!(chainId in this.factory) || !(chainId in this.stateMultiCall))
      throw new Error(`${this.getType()} cannot be instantiated for chainid ${chainId}, no factory or stateMultiCall`)
  }

  public async initialize() {

  }
}
