import type { CodegenConfig } from '@graphql-codegen/cli'

// Generates TS objects from the schemas returned by graphql queries
// To learn more: https://www.apollographql.com/docs/react/development-testing/static-typing/#setting-up-your-project
const config: CodegenConfig = {
  overwrite: true,
  generates: {
    // 'src/__generated__/types-and-hooks.ts': {
    //   schema: [
    //     // Exchange Schema
    //     // 'https://squid.subsquid.io/zenlink-astar/graphql',
    //     'https://squid.subsquid.io/zenlink-bifrost-kusama-squid/graphql',
    //     // Archive Schema
    //     'https://bifrost.explorer.subsquid.io/graphql',
    //   ],
    //   plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    //   documents: ['./src/queries/**', '!./src/queries/uniswap/**'],
    //   config: {
    //     withHooks: true,
    //     // This avoid all generated schemas being wrapped in Maybe
    //     // To learn more: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript#maybevalue-string-default-value-t--null
    //     maybeValue: 'T',
    //   },
    // },
    'src/__generated__/market-types.ts': {
      schema: 'https://hayden-subsquid.squids.live/moonbeam-market/v/v1/graphql',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      documents: ['./src/queries/market/**'],
      config: {
        withHooks: true,
        maybeValue: 'T',
      },
    },
    'src/__generated__/uniswap-v3-types.ts': {
      schema: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      documents: ['./src/queries/uniswap/**'],
      config: {
        withHooks: true,
        maybeValue: 'T',
      },
    },
  },
}

export default config
