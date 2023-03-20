# Zenlink Protocol Interface

This is a monorepo interface for Zenlink -- a protocol for decentralized exchange in Polkadot ecosystem.

## Documentation

- [Integration](docs/Integration.md)

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

- `@zenlink-interface/chain`
- `@zenlink-interface/compat`
- `@zenlink-interface/currency`
- `@zenlink-interface/amm`
- `@zenlink-interface/format`
- `@zenlink-interface/graph-client`
- `@zenlink-interface/hooks`
- `@zenlink-interface/math`
- `@zenlink-interface/eslint-config`
- `@zenlink-interface/typescript-config`
- `@zenlink-interface/redux-token-lists`
- `@zenlink-interface/shared`
- `@zenlink-interface/polkadot`
- `@zenlink-interface/parachains-impl`
  - `bifrost`
- `@zenlink-interface/token-lists`
- `@zenlink-interface/ui`
- `@zenlink-interface/wagmi`
- `@zenlink-interface/smart-router`

## In Planning
