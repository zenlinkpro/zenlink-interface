import { Buffer } from 'node:buffer'
import type { Address } from 'viem'
import { encodePacked, keccak256 } from 'viem'
import MerkleTree from './merkleTree'

export default class BalanceTree {
  private readonly tree: MerkleTree
  constructor(balances: { account: string, amount: bigint }[]) {
    this.tree = new MerkleTree(
      balances.map(({ account, amount }, index) => {
        return BalanceTree.toNode(index, account, amount)
      }),
    )
  }

  public static verifyProof(
    index: number | bigint,
    account: string,
    amount: bigint,
    proof: Buffer[],
    root: Buffer,
  ): boolean {
    let pair = BalanceTree.toNode(index, account, amount)
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item)
    }

    return pair.equals(root)
  }

  // keccak256(abi.encode(index, account, amount))
  public static toNode(index: number | bigint, account: string, amount: bigint): Buffer {
    return Buffer.from(
      keccak256(
        encodePacked(
          ['uint256', 'address', 'uint256'],
          [BigInt(index), account as Address, amount]),
      ).slice(2),
      'hex',
    )
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot()
  }

  // returns the hex bytes32 values of the proof
  public getProof(index: number | bigint, account: string, amount: bigint): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(index, account, amount))
  }
}
