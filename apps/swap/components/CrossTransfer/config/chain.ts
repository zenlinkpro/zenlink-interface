export interface ChainMeta {
  chain: Chains
  chainId: number
  ethereumChainId?: number
  name: string
  icon: string
}

export enum Chains {
  BifrostKusama = 'Bifrost Kusama',
  Astar = 'Astar',
  Moonbeam = 'Moonbeam',
  Moonriver = 'Moonriver',
  Polkadot = 'Polkadot',
  Kusama = 'Kusama',
  Acala = 'Acala',
  Karura = 'Karura',
  Statemine = 'Statemine',
  Statemint = 'Statemint',
  Kintsugi = 'Kintsugi',
  Shiden = 'Shiden',
}

export const CHAIN_META: Record<string, ChainMeta> = {
  [Chains.BifrostKusama]: {
    chain: Chains.BifrostKusama,
    chainId: 2001,
    icon: '',
    name: 'Bifrost Kusama',
  },
  [Chains.Astar]: {
    chain: Chains.Astar,
    chainId: 2006,
    ethereumChainId: 592,
    icon: '',
    name: 'Astar',
  },
  [Chains.Moonriver]: {
    chain: Chains.Moonriver,
    chainId: 2023,
    ethereumChainId: 1285,
    icon: '',
    name: 'Moonriver',
  },
  [Chains.Moonbeam]: {
    chain: Chains.Moonbeam,
    chainId: 2004,
    ethereumChainId: 1284,
    icon: '',
    name: 'Moonbeam',
  },
  [Chains.Polkadot]: {
    chain: Chains.Polkadot,
    chainId: 1,
    icon: '',
    name: 'Polkadot',
  },
  [Chains.Kusama]: {
    chain: Chains.Kusama,
    chainId: 2,
    icon: '',
    name: 'Kusama',
  },
  [Chains.Karura]: {
    chain: Chains.Karura,
    chainId: 2000,
    icon: '',
    name: 'Karura',
  },
  [Chains.Acala]: {
    chain: Chains.Acala,
    chainId: 1,
    icon: '',
    name: 'Acala',
  },
  [Chains.Statemine]: {
    chain: Chains.Statemine,
    chainId: 1000,
    icon: '',
    name: 'Statemine',
  },
  [Chains.Statemint]: {
    chain: Chains.Statemint,
    chainId: 1000,
    icon: '',
    name: 'Statemint',
  },
  [Chains.Kintsugi]: {
    chain: Chains.Kintsugi,
    chainId: 2092,
    icon: '',
    name: 'Kintsugi',
  },
  [Chains.Shiden]: {
    chain: Chains.Shiden,
    chainId: 2007,
    icon: '',
    name: 'Shiden',
  },
}

export const CROSS_TRANSFER_CHAINS = [
  Chains.Acala,
  Chains.Karura,
  Chains.Kintsugi,
  Chains.Shiden,
  Chains.Statemine,
  Chains.Astar,
  Chains.Moonriver,
  Chains.Moonbeam,
  Chains.BifrostKusama,
  Chains.Polkadot,
  Chains.Kusama,
]
