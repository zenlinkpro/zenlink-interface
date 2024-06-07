import { getAddress, isAddress } from '@ethersproject/address'
import type { Token, Type } from '@zenlink-interface/currency'
import { addressToZenlinkAssetId, isZenlinkAddress } from '@zenlink-interface/format'
import { JSBI } from '@zenlink-interface/math'

import type { Tags, TokenInfo, TokenList } from './types'

export * from './lists'
export * from './types'

type TagDetails = Tags[keyof Tags]

interface TagInfo extends TagDetails {
  id: string
}

/**
 * Token instances created from token info on a token list.
 */
export class WrappedTokenInfo implements Token {
  public readonly isNative = false as const
  public readonly isToken = true as const
  public readonly list?: TokenList

  public readonly tokenInfo: TokenInfo

  readonly rebase = { base: JSBI.BigInt(1), elastic: JSBI.BigInt(1) }

  constructor(tokenInfo: TokenInfo, list?: TokenList) {
    this.tokenInfo = tokenInfo
    this.list = list
  }

  private _checksummedAddress: string | null = null

  public get address(): string {
    if (this._checksummedAddress)
      return this._checksummedAddress
    if (!isAddress(this.tokenInfo.address))
      return `${this.tokenInfo.parachainId}-${this.tokenInfo.assetType}-${this.tokenInfo.assetIndex}`
    const checksummedAddress = getAddress(this.tokenInfo.address)
    return (this._checksummedAddress = checksummedAddress)
  }

  public get chainId(): number {
    return this.tokenInfo.parachainId
  }

  public get decimals(): number {
    return this.tokenInfo.decimals
  }

  public get name(): string {
    return this.tokenInfo.name
  }

  public get symbol(): string {
    return this.tokenInfo.symbol
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }

  private _tags: TagInfo[] | null = null
  public get tags(): TagInfo[] {
    if (this._tags !== null)
      return this._tags
    if (!this.tokenInfo.tags)
      return (this._tags = [])
    const listTags = this.list?.tags
    if (!listTags)
      return (this._tags = [])

    return (this._tags = this.tokenInfo.tags.map((tagId) => {
      return {
        ...listTags[tagId],
        id: tagId,
      }
    }))
  }

  equals(other: Type): boolean {
    return other.chainId === this.chainId && other.isToken && other.address.toLowerCase() === this.address.toLowerCase()
  }

  sortsBefore(other: Token): boolean {
    if (this.equals(other))
      throw new Error('Addresses should not be equal')
    if (!isAddress(this.address) && isZenlinkAddress(this.address)) {
      const { chainId, assetType, assetIndex } = addressToZenlinkAssetId(this.address)
      const otherTokenAssetId = addressToZenlinkAssetId(other.address)
      return (
        chainId < otherTokenAssetId.chainId
        || assetType < otherTokenAssetId.assetType
        || assetIndex < otherTokenAssetId.assetIndex
      )
    }
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  public get wrapped(): Token {
    return this
  }
}
