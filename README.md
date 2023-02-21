# Zenlink Protocol Interface

[![packages](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/packages.yml/badge.svg)](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/packages.yml)
[![apps/swap](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/apps-swap.yml/badge.svg)](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/apps-swap.yml)
[![apps/pool](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/apps-pool.yml/badge.svg)](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/apps-pool.yml)
[![apps/referrals](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/apps-referrals.yml/badge.svg)](https://github.com/zenlinkpro/zenlink-interface/actions/workflows/apps-referrals.yml)

This is a monorepo interface for Zenlink -- a protocol for decentralized exchange in Polkadot ecosystem.

## Getting Started

### Install

`pnpm install`

### Dev

`pnpm exec turbo run dev --filter=swap`

### Build

`pnpm run build`

#### Single Repository

`pnpm exec turbo run build --filter=api/app/package`

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

- `@zenlink-interface/apps/referrals`
