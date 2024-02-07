import { CHAIN_META } from './chain'

export interface LinkPoint {
  description?: string
  icon: string
  name: string
  url: string
  urlParse?: (symbol: string, from: string, to: string) => string
}

export enum Apps {
  'AstarDapp' = 'AstarDapp',
  'SubBridgeDapp' = 'SubBridgeDapp',
  'MoonriverApp' = 'MoonriverApp',
  'MoonbeamApp' = 'MoonbeamApp',
  'BifrostDapp' = 'BifrostDapp',
  'MultichainApp' = 'MultichainApp',
  'cBridgeApp' = 'cBridgeApp',
  'Gate.io' = 'Gate.io',
}

export const APP_LINKS: Record<Apps, LinkPoint> = {
  [Apps.AstarDapp]: {
    description: 'Astar Network supports the building of dApps with EVM and WASM smart contracts and offers developers true interoperability with cross-consensus messaging XCM',
    icon: 'https://v5.airtableusercontent.com/v1/15/15/1681293600000/x_1utACzM6H0dAeFc7Nz-g/vjk8V_gFD0MgXzTpHvs0UdKaukIpumq7LQ0NF5HIbkQhP_iPN2N5zs_hkEEDu_h26Qw1CcK4kQcmCgfOIS43Ng/6qrgNCIEQlp0Z9rfGPJuRuK7dSecezdohEMtvQU4Izg',
    name: 'Astar Dapp',
    url: 'https://portal.astar.network/astar/assets',
    urlParse: (symbol, from, to) => {
      const fromChain = CHAIN_META[from]
      const toChain = CHAIN_META[to]
      if (!symbol || !fromChain.name || !toChain.name)
        return 'https://portal.astar.network/astar/assets'
      return `https://portal.astar.network/astar/assets/transfer?token=${symbol.toLocaleLowerCase()}&from=${fromChain.name.toLowerCase()}&to=${toChain.name.toLowerCase()}&mode=xcm`
    },
  },
  [Apps.SubBridgeDapp]: {
    description: 'Cross-chain Router, Bridging Parachain, EVM, and other chains.',
    icon: 'https://v5.airtableusercontent.com/v1/15/15/1681293600000/IKa_Qva7QIPKYpl-WIsTKg/fGOP7kdJM021vPPjvzY1OAQgl1_NzYLG2WCXsD1IDqHZitp9IjebLNByqR0pcvh_gdNHxZhROd8Q5VQ_VITvrA/Lfn5IxAlpWyZVN_8KQCXgPkTgOeap_YBQcFZNerFdOo',
    name: 'SubBridge Dapp',
    url: 'https://subbridge.io/',
  },
  [Apps.MoonbeamApp]: {
    description: 'Ethereum-compatible smart contract parachain on Polkadot',
    icon: 'https://moonbeam.moonscan.io/images/svg/brands/mainbrand-1.svg?v=23.4.1.1',
    name: 'Moonbeam Dapp',
    url: 'https://apps.moonbeam.network/moonbeam/xcm',
  },
  [Apps.BifrostDapp]: {
    description: 'Cross-chain liquidity for Staking',
    icon: 'https://v5.airtableusercontent.com/v1/15/15/1681293600000/nbd7ZQZuWzOTDF5zU3vmGQ/d5uURm5oDPiXEmQpjLFGwGOIsdZJzZf5SlMKkLqfjKdvLsUDV0uKJ-Cj3yzWt6WfsTkgkTyWx3kiU8QXEHaTsQ/K6RpyFHkFpBdMrWAtJrQvimwFOwkAdpd_vY6e5kZyY8',
    name: 'Bifrost Dapp',
    url: 'https://bifrost.app/crosschain',
  },
  [Apps.MoonriverApp]: {
    description: 'Ethereum-compatible smart contract parachain on Kusama',
    icon: 'https://moonriver.moonscan.io/images/svg/brands/mainbrand-1.svg?v=23.4.1.1',
    name: 'Moonriver Dapp',
    url: 'https://apps.moonbeam.network/moonriver/xcm',
  },
  [Apps.MultichainApp]: {
    description: 'Previously Anyswap',
    icon: 'https://v5.airtableusercontent.com/v1/15/15/1681214400000/bRC92pT7-vu1xNL7XC7wzw/lEK9AjwumsnE2iN3K-Q6mE-6FUwI0TNMwwHdByDE0boT2X-RrmhYNeYE7q6wBJqL8DgAOoU4vSG10y0qv2ILcw/QVG3F5_UzLSdpV9mF5-fLX0cOv0R_uIm025JmbAbBls',
    name: 'Multichain Dapp',
    url: 'https://app.multichain.org/#/router',
  },
  [Apps.cBridgeApp]: {
    description: 'Bring Internet Scale to Every Blockchain',
    icon: 'https://v5.airtableusercontent.com/v1/15/15/1681279200000/wwiYCaxjKOAXKTahM_atdg/T5HBB8FikVHy9mkl8XmTl9oObYTxI-DrfeUM0cQ-KYOd5V6lt6XduVZt295ORE1EvMBVnwPqBKu6H-vYnMGtLg/ulDG74JbxwAf6a3RD781w34Tem6ni9mYylTYQ94akvA',
    name: 'cBridge Dapp',
    url: 'https://cbridge.celer.network',
    urlParse: (symbol, from, to) => {
      const fromChain = CHAIN_META[from]
      const toChain = CHAIN_META[to]
      if (!symbol || !fromChain.ethereumChainId || !toChain.ethereumChainId)
        return 'https://cbridge.celer.network'
      return `https://cbridge.celer.network/${fromChain.ethereumChainId}/${toChain.ethereumChainId}/${symbol}`
    },
  },
  [Apps['Gate.io']]: {
    description: 'Gate.io is a full-service digital asset exchange platform covering millions of users around the world.',
    icon: 'https://play-lh.googleusercontent.com/KqxTJaobe2oyS2mheSfSgYiu8yQX23DNcD2e7fQ8Mqwy-Nmcd37FL9ljvqCQxoee0iA=w480-h960-rw',
    name: 'Gate.io',
    url: 'https://www.gate.io/',
  },
}
