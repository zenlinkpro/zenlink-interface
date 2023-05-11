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
    name: 'Bifrost Kusama',
    icon: '',
  },
  [Chains.Astar]: {
    chain: Chains.Astar,
    chainId: 2006,
    ethereumChainId: 592,
    name: 'Astar',
    icon: '',
  },
  [Chains.Moonriver]: {
    chain: Chains.Moonriver,
    chainId: 2023,
    ethereumChainId: 1285,
    name: 'Moonriver',
    icon: '',
  },
  [Chains.Moonbeam]: {
    chain: Chains.Moonbeam,
    chainId: 2004,
    ethereumChainId: 1284,
    name: 'Moonbeam',
    icon: '',
  },
  [Chains.Polkadot]: {
    chain: Chains.Polkadot,
    chainId: 1,
    name: 'Polkadot',
    icon: '',
  },
  [Chains.Kusama]: {
    chain: Chains.Kusama,
    chainId: 2,
    name: 'Kusama',
    icon: '',
  },
  [Chains.Karura]: {
    chain: Chains.Karura,
    chainId: 2000,
    name: 'Karura',
    icon: '',
  },
  [Chains.Acala]: {
    chain: Chains.Acala,
    chainId: 1,
    name: 'Acala',
    icon: '',
  },
  [Chains.Statemine]: {
    chain: Chains.Statemine,
    chainId: 1000,
    name: 'Statemine',
    icon: '',
  },
  [Chains.Statemint]: {
    chain: Chains.Statemint,
    chainId: 1000,
    name: 'Statemint',
    icon: '',
  },
  [Chains.Kintsugi]: {
    chain: Chains.Kintsugi,
    chainId: 2092,
    name: 'Kintsugi',
    icon: '',
  },
  [Chains.Shiden]: {
    chain: Chains.Shiden,
    chainId: 2007,
    name: 'Shiden',
    icon: '',
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
