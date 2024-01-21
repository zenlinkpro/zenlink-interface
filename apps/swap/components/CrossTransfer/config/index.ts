import { Apps } from './app'
import { Chains } from './chain'
import { TokenSymbol } from './token'

export const CROSS_TRANSFER_CONFIG: Record<string, Record<string, Record<string, Apps[]>>> = {
  [TokenSymbol.ACA]: {
    [Chains.Acala]: {
      [Chains.Moonbeam]: [Apps.MoonbeamApp],
    },
    [Chains.Moonbeam]: {
      [Chains.Acala]: [Apps.MoonbeamApp],
    },
  },
  [TokenSymbol.aUSD]: {
    [Chains.Acala]: {
      [Chains.Moonbeam]: [Apps.MoonbeamApp],
      [Chains.Moonriver]: [Apps.MoonriverApp],
    },
    [Chains.Moonbeam]: {
      [Chains.Acala]: [Apps.MoonbeamApp],
    },
    [Chains.Moonriver]: {
      [Chains.Acala]: [Apps.MoonriverApp],
    },
  },
  [TokenSymbol.DOT]: {
    [Chains.Polkadot]: {
      [Chains.Moonbeam]: [Apps.MoonbeamApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
      [Chains.Astar]: [Apps.AstarDapp],
    },
    [Chains.Moonbeam]: {
      [Chains.Polkadot]: [Apps.MoonbeamApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Polkadot]: [Apps.BifrostDapp],
    },
    [Chains.Astar]: {
      [Chains.Polkadot]: [Apps.AstarDapp],
    },
  },
  [TokenSymbol.USDT]: {
    [Chains.Statemine]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
    [Chains.Statemint]: {
      [Chains.Moonbeam]: [Apps.MoonbeamApp],
      [Chains.Astar]: [Apps.AstarDapp],
    },
    [Chains.Moonbeam]: {
      [Chains.Statemint]: [Apps.MoonbeamApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Statemine]: [Apps.BifrostDapp],
    },
    [Chains.Astar]: {
      [Chains.Statemint]: [Apps.AstarDapp],
    },
  },
  [TokenSymbol.KINT]: {
    [Chains.Kintsugi]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
    [Chains.Moonriver]: {
      [Chains.Kintsugi]: [Apps.MoonriverApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Kintsugi]: [Apps.BifrostDapp],
    },
  },
  [TokenSymbol.KBTC]: {
    [Chains.Kintsugi]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
    [Chains.Moonriver]: {
      [Chains.Kintsugi]: [Apps.MoonriverApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Kintsugi]: [Apps.BifrostDapp],
    },
  },
  [TokenSymbol.ZLK]: {
    [Chains.Astar]: {
      [Chains.Moonbeam]: [Apps.cBridgeApp],
    },
    [Chains.Moonbeam]: {
      [Chains.Astar]: [Apps.cBridgeApp],
      // [Chains.Moonriver]: [Apps.MultichainApp],
    },
    [Chains.Moonriver]: {
      // [Chains.Moonbeam]: [Apps.MultichainApp],
      [Chains.BifrostKusama]: [Apps['Gate.io']],
    },
    [Chains.BifrostKusama]: {
      [Chains.Moonriver]: [Apps.SubBridgeDapp],
    },
  },
  [TokenSymbol.BNC]: {
    [Chains.BifrostKusama]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.Karura]: [Apps.BifrostDapp],
    },
    [Chains.Moonriver]: {
      [Chains.BifrostKusama]: [Apps.MoonriverApp],
    },
    [Chains.Karura]: {
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
  },
  [TokenSymbol.KAR]: {
    [Chains.Karura]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
    [Chains.Moonriver]: {
      [Chains.Karura]: [Apps.MoonriverApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Karura]: [Apps.BifrostDapp],
    },
  },
  [TokenSymbol.SDN]: {
    [Chains.Shiden]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
    },
    [Chains.Moonriver]: {
      [Chains.Shiden]: [Apps.MoonriverApp],
    },
  },
  [TokenSymbol.vsKSM]: {
    [Chains.BifrostKusama]: {
      [Chains.Karura]: [Apps.BifrostDapp],
    },
    [Chains.Karura]: {
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
  },
  [TokenSymbol.RMRK]: {
    [Chains.Statemine]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
    [Chains.Moonriver]: {
      [Chains.Statemine]: [Apps.MoonriverApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Statemine]: [Apps.BifrostDapp],
    },
  },
  [TokenSymbol.KSM]: {
    [Chains.Kusama]: {
      [Chains.Moonriver]: [Apps.MoonriverApp],
      [Chains.BifrostKusama]: [Apps.BifrostDapp],
    },
    [Chains.Moonriver]: {
      [Chains.Kusama]: [Apps.MoonriverApp],
    },
    [Chains.BifrostKusama]: {
      [Chains.Kusama]: [Apps.BifrostDapp],
    },
  },
}
