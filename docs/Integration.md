# Documentation: Integration

A brief overview how to integrate other chains.

## Chain-related configuration

- Add the chain info in `packages/chain/${chains | parachains}`
- Add the info below the `ParachainId`, `ChainKey`... in `index.ts`
- Run `pnpm run build`

## Token-related configuration

Add a json file in the same format below `packages/token-lists/lists` and export it in `index.ts`

## Basic operation implementation

`EVM base` - The `wagmi` package does most of the basic operations, just update the contract address, etc.

`Substrate base` - The `polkadot` package does most of the basic operations, you need to implement special operations based on different chains, like `packages/parachains-impl/bifrost` 

## Add GraphQL Service

We have a GraphQL Service as the index of data below `pacakges/graph-client`. These are examples of different chains

- [bifrost-kusama-squid](https://github.com/zenlinkpro/bifrost-kusama-squid)
- [astar-subsquid](https://github.com/zenlinkpro/zenlink-astar-subsquid)

## Other configurations
- token icons
- chain icons
- localstorage
