type ExtensionValue = string | number | boolean | null | undefined

export interface TokenInfo {
  readonly networkId: number
  readonly parachainId: number
  readonly address: string
  readonly assetType: number
  readonly assetIndex: number
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  readonly logoURI?: string
  readonly tags?: string[]
  readonly extensions?: {
    readonly [key: string]: {
      [key: string]: {
        [key: string]: ExtensionValue
      } | ExtensionValue
    } | ExtensionValue
  }
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string
    readonly description: string
  }
}

export interface TokenList {
  readonly name: string
  readonly timestamp: string
  readonly tokens: TokenInfo[]
  readonly keywords?: string[]
  readonly tags?: Tags
  readonly logoURI?: string
}
