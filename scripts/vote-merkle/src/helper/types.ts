import invariant from 'tiny-invariant'

export type RC = Record<string, bigint>

export interface UserLeafData {
  amount: string
  leaf: string
}

export interface MerkleDistributionOutput {
  merkleRoot: string
  rawUserLeaves: string[]
  usersLeafData: Record<string, UserLeafData>
}

export class VeBalanceSnapshot {
  slope: bigint
  bias: bigint
  timestamp: number

  constructor(slope: bigint, bias: bigint, timestamp: number) {
    this.slope = slope
    this.bias = bias
    this.timestamp = timestamp
  }

  valueAt(time: number): bigint {
    const value = this.bias - this.slope * BigInt(time)
    return value > 0 ? value : BigInt(0)
  }
}

export class UserVeBalanceList {
  index: number
  snapshots: VeBalanceSnapshot[]

  constructor() {
    this.snapshots = []
    this.index = 0
  }

  valueAt(time: number): bigint {
    invariant(this.index < this.snapshots.length, '[UserVeBalanceList] index out of bound')
    if (this.snapshots.length === 0) {
      return BigInt(0)
    }
    if (this.snapshots[0].timestamp > time) {
      return BigInt(0)
    }
    if (this.snapshots[this.index].timestamp > time) {
      this.index = 0
    }
    while (this.index + 1 < this.snapshots.length && this.snapshots[this.index + 1].timestamp <= time) {
      this.index++
    }
    return this.snapshots[this.index].valueAt(time)
  }

  addSnapshot(slope: bigint, bias: bigint, timestamp: number) {
    this.snapshots.push(new VeBalanceSnapshot(slope, bias, timestamp))
  }
}

// PoolData[pool][user] = UserVeBalanceList
export type PoolsData = Record<string, Record<string, UserVeBalanceList>>
