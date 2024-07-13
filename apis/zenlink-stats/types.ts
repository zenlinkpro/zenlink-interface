import type { Address, Hex } from 'viem'

export interface ClaimData {
  index: number
  amount: string
  proof: Hex[]
}

export interface ClaimDataWithContract extends ClaimData {
  contractAddress: Address
}

export interface BalanceMap {
  merkleRoot: Hex
  tokenTotal: string
  claims: Record<string, ClaimData>
}

export interface MerkleResults {
  contractAddress: Address
  sumReward: string
  userRewards: Record<string, string>
  balanceMap: BalanceMap
}
