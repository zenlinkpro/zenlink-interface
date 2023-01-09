import type { CodegenConfig } from '@graphql-codegen/cli'

// Generates TS objects from the schemas returned by graphql queries
// To learn more: https://www.apollographql.com/docs/react/development-testing/static-typing/#setting-up-your-project
const config: CodegenConfig = {
  overwrite: true,
  schema: [
    // Exchange Schema
    'https://squid.subsquid.io/Zenlink-Astar-Squid/graphql',
    // Archive Schema
    'https://bifrost.explorer.subsquid.io/graphql',
  ],
  generates: {
    'src/__generated__/types-and-hooks.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      documents: ['./src/queries/**'],
      config: {
        withHooks: true,
        // This avoid all generated schemas being wrapped in Maybe https://the-guild.dev/graphql/codegen/plugins/typescript/typescript#maybevalue-string-default-value-t--null
        maybeValue: 'T',
      },
    },
  },
}

export default config
