import { getAddress, isAddress } from 'viem'
import BalanceTree from './balanceTree'

export interface MerkleDistributorInfo {
  merkleRoot: string
  tokenTotal: string
  claims: {
    [account: string]: {
      index: number
      amount: string
      proof: string[]
    }
  }
}

interface OldFormat {
  [account: string]: number | string
}

interface NewFormat {
  address: string
  earnings: string
}

export function parseBalanceMap(balances: OldFormat | NewFormat[]): MerkleDistributorInfo {
  // if balances are in an old format, process them
  const balancesInNewFormat: NewFormat[] = Array.isArray(balances)
    ? balances
    : Object.keys(balances).map(
        (account): NewFormat => ({
          address: account,
          earnings: balances[account].toString(),
        }),
      )

  const dataByAddress = balancesInNewFormat.reduce<{
    [address: string]: { amount: bigint }
  }>((memo, { address: account, earnings }) => {
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`)
    }
    const parsed = getAddress(account)
    if (memo[parsed])
      throw new Error(`Duplicate address: ${parsed}`)
    const parsedNum = BigInt(earnings)
    if (parsedNum <= 0)
      throw new Error(`Invalid amount for account: ${account}`)

    memo[parsed] = { amount: parsedNum }
    return memo
  }, {})

  const sortedAddresses = Object.keys(dataByAddress).sort()

  // construct a tree
  const tree = new BalanceTree(
    sortedAddresses.map(address => ({ account: address, amount: dataByAddress[address].amount })),
  )

  // generate claims
  const claims = sortedAddresses.reduce<{
    [address: string]: { amount: string, index: number, proof: string[], flags?: { [flag: string]: boolean } }
  }>((memo, address, index) => {
    const { amount } = dataByAddress[address]
    memo[address] = {
      index,
      amount: amount.toString(),
      proof: tree.getProof(index, address, amount),
    }
    return memo
  }, {})

  const tokenTotal: bigint = sortedAddresses.reduce<bigint>(
    (memo, key) => memo + dataByAddress[key].amount,
    BigInt(0),
  )

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: tokenTotal.toString(),
    claims,
  }
}
