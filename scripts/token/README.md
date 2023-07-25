# Update token and pairs script

### How to install

```shell
pnpm install
```

### How to use

##### 1. Choose the correct chain configuration

```typescript
const currentChain = configs.mantaStaging
```

##### 2. Run script

```shell
pnpm start
```

### Note for this script

> We need to update three places when chain info updated, e.g.
- tokens info: ../../packages/token-lists/lists/manta-staging.json
- pairs info: ../../packages/parachains-impl/manta/pair-configs/manta-staging.json
- stable coins info: ../../packages/currency/src/constants/tokenAddresses.ts (need to manual update)