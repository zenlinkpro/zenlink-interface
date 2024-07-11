import type { Hex } from 'viem'

export interface ClaimData {
  index: number
  amount: string
  proof: Hex[]
}

export interface BalanceMap {
  merkleRoot: string
  tokenTotal: string
  claims: Record<string, ClaimData>
}

export interface MerkleResults {
  sumReward: string
  userRewards: Record<string, string>
  balanceMap: BalanceMap
}
