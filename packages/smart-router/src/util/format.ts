import type { Address } from 'viem'

export function formatAddress(address: Address | string): string {
  return address.toLocaleLowerCase().substring(2).padStart(40, '0')
}
