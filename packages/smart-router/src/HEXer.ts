import type { BigNumber } from 'ethers'

export class HEXer {
  private hex: string

  public constructor() {
    this.hex = ''
  }

  public toString() {
    return this.hex
  }

  public toHexString(): `0x${string}` {
    return `0x${this.hex}`
  }

  public toString0x() {
    // for backwards compatibility for now
    return this.toHexString()
  }

  public uint8(data: number): HEXer {
    if (data > 255 || data < 0 || data !== Math.round(data))
      throw new Error(`Wrong uint8: ${data}`)

    this.hex += data.toString(16).padStart(2, '0')

    return this
  }

  public bool(data: boolean): HEXer {
    return this.uint8(data ? 1 : 0)
  }

  public uint16(data: number): HEXer {
    if (data >= 256 * 256 || data < 0 || data !== Math.round(data))
      throw new Error(`Wrong uint16: ${data}`)

    this.hex += data.toString(16).padStart(4, '0')

    return this
  }

  public share16(share: number): HEXer {
    return this.uint16(Math.round(share * 65535))
  }

  public uint32(data: number): HEXer {
    if (data >= 256 * 256 * 256 * 256 || data < 0 || data !== Math.round(data))
      throw new Error(`Wrong uint32: ${data}`)

    this.hex += data.toString(16).padStart(8, '0')

    return this
  }

  public uint256(data: BigNumber | number): HEXer {
    if (typeof data == 'number') {
      if (data > Number.MAX_SAFE_INTEGER || data < 0 || data !== Math.round(data))
        throw new Error(`Wrong uint256: ${data}`)

      this.hex += data.toString(16).padStart(64, '0')

      return this
    }
    else {
      const hex = data.toHexString().slice(2).padStart(64, '0')
      if (data.lt(0) || hex.length > 64)
        throw new Error(`Wrong uin256: ${data.toString()}`)

      this.hex += hex

      return this
    }
  }

  public uint(data: BigNumber | number): HEXer {
    return this.uint256(data)
  }

  public address(addr: string): HEXer {
    if (addr.length > 42 || addr === 'RouteProcessor')
      throw new Error(`Wrong address: ${addr}`)

    // 0xabcd => 0000abcd
    this.hex += addr.slice(2).padStart(40, '0')

    return this
  }

  public hexData(data: string): HEXer {
    if (data.length % 2 !== 0)
      throw new Error(`Wrong hex data length: ${data.length}`)

    if (data.startsWith('0x'))
      data = data.slice(2)
    this.hex += data

    return this
  }

  public bytes(data: string): HEXer {
    if (data.length % 2 !== 0)
      throw new Error(`Wrong bytes length: ${data.length}`)

    if (data.startsWith('0x'))
      data = data.slice(2)
    this.uint(data.length / 2)
    this.hex += data

    return this
  }
}
