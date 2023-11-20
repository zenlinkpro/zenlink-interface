import path from 'node:path'

export default {
  calamari: {
    networkId: 400,
    chainId: 2084,
    endPoint: 'wss://zenlink.zqhxuyuan.cloud:444',
    distTokensTitle: 'calamari kusama',
    distTokensFilePath: path.resolve(
      __dirname,
      '../../../packages/token-lists/lists/calamari-kusama.json',
    ),
    distPairsTitle: 'Calamari Pairs',
    distPairsFilePath: path.resolve(
      __dirname,
      '../../../packages/parachains-impl/manta/pair-configs/calamari.json',
    ),
    forceIncludeTokens: [],
  },
  mantaStaging: {
    networkId: 510,
    chainId: 2104,
    endPoint: 'wss://c1.manta.seabird.systems',
    distTokensTitle: 'manta staging',
    distTokensFilePath: path.resolve(
      __dirname,
      '../../../packages/token-lists/lists/manta-staging.json',
    ),
    distPairsTitle: 'Manta Staging Pairs',
    distPairsFilePath: path.resolve(
      __dirname,
      '../../../packages/parachains-impl/manta/pair-configs/manta-staging.json',
    ),
    forceIncludeTokens: ['2104-2-31'],
  },
  manta: {
    networkId: 500,
    chainId: 2104,
    endPoint: 'wss://ws.manta.systems',
    distTokensTitle: 'manta polkadot',
    distTokensFilePath: path.resolve(
      __dirname,
      '../../../packages/token-lists/lists/manta-polkadot.json',
    ),
    distPairsTitle: 'Manta Pairs',
    distPairsFilePath: path.resolve(
      __dirname,
      '../../../packages/parachains-impl/manta/pair-configs/manta.json',
    ),
    forceIncludeTokens: [],
  },
}
