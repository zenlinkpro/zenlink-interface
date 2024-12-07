import {
  AcalaCircle,
  AstarCircle,
  BifrostCircle,
  KaruraCircle,
  KintsugiCircle,
  KusamaCircle,
  MoonbeamCircle,
  MoonriverCircle,
  PolkadotCircle,
  ShidenCircle,
  StatemineCircle,
} from '@zenlink-interface/ui/icons/network/circle'
import {
  AcalaNaked,
  AstarNaked,
  BifrostNaked,
  KaruraNaked,
  KintsugiNaked,
  KusamaNaked,
  MoonbeamNaked,
  MoonriverNaked,
  PolkadotNaked,
  ShidenNaked,
  StatemineNaked,
} from '@zenlink-interface/ui/icons/network/naked'
import { Chains } from '../config/chain'

export const CROSS_TRANSFER_NETWORK_NAKED_ICON: Record<Chains, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [Chains.Moonriver]: MoonriverNaked,
  [Chains.Moonbeam]: MoonbeamNaked,
  [Chains.Astar]: AstarNaked,
  [Chains.BifrostKusama]: BifrostNaked,
  [Chains.Polkadot]: PolkadotNaked,
  [Chains.Kusama]: KusamaNaked,
  [Chains.Acala]: AcalaNaked,
  [Chains.Karura]: KaruraNaked,
  [Chains.Statemine]: StatemineNaked,
  [Chains.Statemint]: StatemineNaked,
  [Chains.Kintsugi]: KintsugiNaked,
  [Chains.Shiden]: ShidenNaked,
}

export const CROSS_TRANSFER_NETWORK_CIRCLE_ICON: Record<Chains, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [Chains.Moonriver]: MoonriverCircle,
  [Chains.Moonbeam]: MoonbeamCircle,
  [Chains.Astar]: AstarCircle,
  [Chains.BifrostKusama]: BifrostCircle,
  [Chains.Polkadot]: PolkadotCircle,
  [Chains.Kusama]: KusamaCircle,
  [Chains.Acala]: AcalaCircle,
  [Chains.Karura]: KaruraCircle,
  [Chains.Statemine]: StatemineCircle,
  [Chains.Statemint]: StatemineCircle,
  [Chains.Kintsugi]: KintsugiCircle,
  [Chains.Shiden]: ShidenCircle,
}
