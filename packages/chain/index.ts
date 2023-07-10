import json from './chains.json'
import parachains from './parachains.json'

export interface Ens {
  registry: string
}

export enum Standard {
  Eip3091 = 'EIP3091',
  None = 'none',
}

export interface Explorer {
  name: string
  url: string
  standard: Standard
  icon?: string
}

export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export enum Network {
  Iorachain = 'iorachain',
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export interface Bridge {
  url: string
}

export interface Parent {
  type: Type
  chain: string
  bridges?: Bridge[]
}

export enum Type {
  L2 = 'L2',
  Shard = 'shard',
}

export enum EthereumChainId {
  ASTAR = 592,
  MOONRIVER = 1285,
  MOONBEAM = 1284,
  ARBITRUM_ONE = 42161,
}

export enum ParachainId {
  CALAMARI_KUSAMA = 2084,
  MANTA_STAGING = 2104,
  MANTA_POLKADOT = 21040,
  ASTAR = 2006,
  MOONRIVER = 2023,
  MOONBEAM = 2004,
  BIFROST_KUSAMA = 2001,
  BIFROST_POLKADOT = 2030,
  ARBITRUM_ONE = 42161,
}

export enum ChainKey {
  CALAMARI_KUSAMA = 'Calamari Network',
  MANTA_STAGING = 'Manta Staging',
  MANTA_POLKADOT = 'Manta Network',
  ASTAR = 'Astar',
  MOONBEAM = 'Moonbeam',
  MOONRIVER = 'Moonriver',
  BIFROST_KUSAMA = 'Bifrost Kusama',
  BIFROST_POLKADOT = 'Bifrost Polkadot',
  ARBITRUM_ONE = 'Arbitrum One',
}

export interface Chain {
  name: string
  chain: string
  icon?: string
  rpc: string[]
  faucets: string[]
  nativeCurrency: NativeCurrency
  infoURL: string
  shortName: string
  chainId: number
  parachainId: number
  prefix?: number
  networkId: number
  slip44?: number
  ens?: Ens
  explorers?: Explorer[]
  title?: string
  parent?: Parent
  network?: Network
}

// export const CHAIN_NAMES = ['Astar', 'Moonbeam', 'Moonriver', 'Bifrost Kusama', 'Bifrost Polkadot', 'Arbitrum One', 'Calamari Network', 'Manta Polkadot']
export const CHAIN_NAMES = ['Calamari Network', 'Manta Staging', 'Manta Network']
export const PARACHAIN_ID_MAP: { [chainName: string]: number } = {
  'Calamari Network': 2084,
  'Manta Staging': 2104,
  'Manta Network': 21040,
  'Astar': 2006,
  'Moonriver': 2023,
  'Moonbeam': 2004,
  'Bifrost Kusama': 2001,
  'Bifrost Polkadot': 2030,
  'Arbitrum One': 42161,
}
const CHAINS = [...json, ...parachains]
  .filter(chain => CHAIN_NAMES.includes(chain.name))
  .map(chain => ({ ...chain, parachainId: PARACHAIN_ID_MAP[chain.name] })) as Chain[]

export class Chain implements Chain {
  public static from(chainId: number) {
    return chains[chainId]
  }

  public static fromShortName(shortName: string) {
    return chains[chainShortName[shortName]]
  }

  public static fromChainId(chainId: number) {
    return chains[chainId]
  }

  constructor(data: Chain) {
    Object.assign(this, data)
  }

  getTxUrl(txHash: string): string {
    if (!this.explorers)
      return ''
    for (const explorer of this.explorers) {
      if (explorer)
        return `${explorer.url}/tx/${txHash}`
    }
    return ''
  }

  getBlockUrl(blockHashOrHeight: string): string {
    if (!this.explorers)
      return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091)
        return `${explorer.url}/block/${blockHashOrHeight}`
    }
    return ''
  }

  getTokenUrl(tokenAddress: string): string {
    if (!this.explorers)
      return ''
    for (const explorer of this.explorers) {
      if (explorer)
        return `${explorer.url}/token/${tokenAddress}`
    }
    return ''
  }

  getAccountUrl(accountAddress: string): string {
    if (!this.explorers)
      return ''
    for (const explorer of this.explorers) {
      if (explorer) {
        if (explorer.name === 'subscan')
          return `${explorer.url}/account/${accountAddress}`
        return `${explorer.url}/address/${accountAddress}`
      }
    }
    return ''
  }
}

// ChainId array
export const chainIds = CHAINS.map(chain => chain.parachainId)

// Parachain Short Name => Chain Id mapping
export const chainShortNameToChainId = Object.fromEntries(
  CHAINS.map((data): [string, number] => [data.shortName, data.parachainId]),
)

// Parachain Id => Short Name mapping
export const chainShortName = Object.fromEntries(
  CHAINS.map((data): [number, string] => [data.parachainId, data.shortName]),
)

// Parachain Id => Chain Name mapping
export const chainName = Object.fromEntries(
  CHAINS.map((data): [number, string] => [data.parachainId, data.name]),
)

// Parachain Id => Chain mapping
export const chains = Object.fromEntries(
  CHAINS.map((data): [number, Chain] => [data.parachainId, new Chain(data) as Chain]),
)

// Parachain Id => Ethereum ChainId mapping
export const chainsParachainIdToChainId = Object.fromEntries(
  CHAINS.map((data): [number, number] => [data.parachainId, data.chainId]),
)

// Ethereum ChainId => Parachain Id mapping
export const chainsChainIdToParachainId = Object.fromEntries(
  CHAINS.map((data): [number, number] => [data.chainId, data.parachainId]),
)

export default chains

export const EVM_NETWORKS: ParachainId[] = [
  // ParachainId.ASTAR,
  // ParachainId.MOONRIVER,
  // ParachainId.MOONBEAM,
  // ParachainId.ARBITRUM_ONE,
]

export const SUBSTRATE_NETWORKS = [
  // ParachainId.BIFROST_KUSAMA,
  // ParachainId.BIFROST_POLKADOT,
  ParachainId.CALAMARI_KUSAMA,
  ParachainId.MANTA_STAGING,
  // ParachainId.MANTA_POLKADOT,
]

export function isEvmNetwork(chainId: ParachainId) {
  return EVM_NETWORKS.includes(chainId)
}

export function isSubstrateNetwork(chainId: ParachainId) {
  return SUBSTRATE_NETWORKS.includes(chainId)
}
