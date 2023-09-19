import { getAddress as getEvmAddress, isAddress as isEvmAddress } from '@ethersproject/address'

export interface ZenlinkProtocolPrimitivesAssetId {
  chainId: number
  assetType: number
  assetIndex: number
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, characters = 4): string {
  try {
    const parsed = getAddress(address)
    return `${parsed.substring(0, characters + 2)}...${parsed.substring(address.length - characters)}`
  }
  catch {
    return `${address.substring(0, characters + 2)}...${address.substring(address.length - characters)}`
  }
}

export function isAddress(address: string): boolean {
  return isZenlinkAddress(address) || isEvmAddress(address)
}

export function getAddress(address: string): string {
  if (!isAddress(address))
    return address
  if (isEvmAddress(address))
    return getEvmAddress(address)
  return address
}

export function isZenlinkAddress(address: string): boolean {
  return /^\d+(-\d+)(-\d+)$/.test(address)
}

export function addressToZenlinkAssetId(address: string): ZenlinkProtocolPrimitivesAssetId {
  if (!isZenlinkAddress(address))
    throw new Error('invalid address')
  const [chainId, assetType, assetIndex] = address.split('-')
  return {
    chainId: Number(chainId),
    assetType: Number(assetType),
    assetIndex: Number(assetIndex),
  }
}

export function zenlinkAssetIdToAddress({ chainId, assetType, assetIndex }: ZenlinkProtocolPrimitivesAssetId): string {
  return `${chainId}-${assetType}-${assetIndex}`
}
