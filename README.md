# Zenlink Protocol Interface

This is a monorepo interface for Zenlink -- a protocol for decentralized exchange in Polkadot ecosystem.

## Documentation

- **Integration Breakdown** can be found under [docs/Integration.md](docs/Integration.md)
- **Aggregation Swap V2 Breakdown** can be found under [docs/V2AggregationSwap.md](docs/V2AggregationSwap.md)

## Getting Started

### Install

`pnpm install`

### Build

`pnpm run build`

#### Single Repository

`pnpm exec turbo run build --filter=api/app/package`

### Dev

`pnpm exec turbo run dev --filter=swap`

### Test

`pnpm run test`

#### Single Repository

`pnpm exec turbo run test --filter=api/app/package`

### Clean

`pnpm run clean`

#### Single Repository

`pnpm exec turbo run clean --filter=api/app/package`

## Packages

- `@zenlink-interface/amm`
- `@zenlink-interface/chain`
- `@zenlink-interface/compat`
- `@zenlink-interface/config`
  - `eslint`
  - `graph`
  - `nextjs`
  - `polkadot`
  - `router`
  - `typescript`
  - `wagmi`
- `@zenlink-interface/currency`
- `@zenlink-interface/format`
- `@zenlink-interface/graph-client`
- `@zenlink-interface/hooks`
- `@zenlink-interface/locales`
- `@zenlink-interface/math`
- `@zenlink-interface/parachains-impl`
  - `bifrost`
  - `amplitude`
- `@zenlink-interface/polkadot`
- `@zenlink-interface/redux`
  - `localstorage`
  - `token-lists`
- `@zenlink-interface/shared`
- `@zenlink-interface/smart-router`
- `@zenlink-interface/token-lists`
- `@zenlink-interface/ui`
- `@zenlink-interface/wagmi`
- `@zenlink-interface/market`

## In Planning

## License

[LGPL](/LICENSE) License

<br />

<a href="https://vercel.com/zenlink-interface">
  <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" height="35">
</a>
