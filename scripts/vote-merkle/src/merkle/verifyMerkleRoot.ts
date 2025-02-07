/* eslint-disable no-console */
import type { Address } from 'viem'
import type { MerkleDistributorInfo } from './parseBalanceMap'
import { Buffer } from 'node:buffer'
import { bytesToHex, encodePacked, keccak256 } from 'viem'

function combinedHash(first: Buffer, second: Buffer): Buffer {
  if (!first) {
    return second
  }
  if (!second) {
    return first
  }

  return Buffer.from(
    keccak256(
      encodePacked(
        ['bytes32', 'bytes32'],
        [first, second].sort(Buffer.compare).map(v => bytesToHex(v)) as [Address, Address],
      ),
    ).slice(2),
    'hex',
  )
}

function toNode(index: number | bigint, account: string, amount: bigint): Buffer {
  const pairHex = keccak256(
    encodePacked(
      ['uint256', 'address', 'uint256'],
      [BigInt(index), account as Address, amount],
    ),
  )
  return Buffer.from(pairHex.slice(2), 'hex')
}

function verifyProof(
  index: number | bigint,
  account: string,
  amount: bigint,
  proof: Buffer[],
  root: Buffer,
): boolean {
  let pair = toNode(index, account, amount)
  for (const item of proof) {
    pair = combinedHash(pair, item)
  }

  return pair.equals(root)
}

function getNextLayer(elements: Buffer[]): Buffer[] {
  return elements.reduce<Buffer[]>((layer, el, idx, arr) => {
    if (idx % 2 === 0) {
      // Hash the current element with its pair element
      layer.push(combinedHash(el, arr[idx + 1]))
    }

    return layer
  }, [])
}

function getRoot(balances: { account: string, amount: bigint, index: number }[]): Buffer {
  let nodes = balances
    .map(({ account, amount, index }) => toNode(index, account, amount))
    // sort by lexicographical order
    .sort(Buffer.compare)

  // deduplicate any eleents
  nodes = nodes.filter((el, idx) => {
    return idx === 0 || !nodes[idx - 1].equals(el)
  })

  const layers = []
  layers.push(nodes)

  // Get next layer until we reach the root
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]))
  }

  return layers[layers.length - 1][0]
}

export function verifyMerkleRoot(info: MerkleDistributorInfo): boolean {
  const merkleRootHex = info.merkleRoot
  const merkleRoot = Buffer.from(merkleRootHex.slice(2), 'hex')

  const balances: { index: number, account: string, amount: bigint }[] = []
  let valid = true

  Object.keys(info.claims).forEach((address) => {
    const claim = info.claims[address]
    const proof = claim.proof.map((p: string) => Buffer.from(p.slice(2), 'hex'))
    balances.push({ index: claim.index, account: address, amount: BigInt(claim.amount) })
    if (verifyProof(claim.index, address, BigInt(claim.amount), proof, merkleRoot)) {
      console.log('Verified proof for', claim.index, address)
    }
    else {
      console.log('Verification for', address, 'failed')
      valid = false
    }
  })

  if (!valid) {
    console.error('Failed validation for 1 or more proofs')
    process.exit(1)
  }
  console.log('Done!')

  // Root
  const root = getRoot(balances).toString('hex')
  console.log('Reconstructed merkle root', root)
  console.log('Root matches the one read from the JSON?', root === merkleRootHex.slice(2))

  return root === merkleRootHex.slice(2)
}
