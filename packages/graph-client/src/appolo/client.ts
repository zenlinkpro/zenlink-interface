import type { ApolloClientOptions, NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { createLink } from './link'

export const DEFAULT_CLIENT_OPTIONS: Omit<ApolloClientOptions<NormalizedCacheObject>, 'cache'> = {
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
}

export const CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  // [ParachainId.MOONRIVER]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.MOONRIVER),
  //   cache: new InMemoryCache(),
  // }),
  // [ParachainId.MOONBEAM]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.MOONBEAM),
  //   cache: new InMemoryCache(),
  // }),
  // [ParachainId.ASTAR]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.ASTAR),
  //   cache: new InMemoryCache(),
  // }),
  // [ParachainId.BIFROST_KUSAMA]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.BIFROST_KUSAMA),
  //   cache: new InMemoryCache(),
  // }),
  [ParachainId.CALAMARI_KUSAMA]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLink(ParachainId.CALAMARI_KUSAMA),
    cache: new InMemoryCache(),
  }),
  [ParachainId.MANTA_STAGING]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLink(ParachainId.MANTA_STAGING),
    cache: new InMemoryCache(),
  }),
  // [ParachainId.BIFROST_POLKADOT]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.BIFROST_POLKADOT),
  //   cache: new InMemoryCache(),
  // }),
  // [ParachainId.ARBITRUM_ONE]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.ARBITRUM_ONE),
  //   cache: new InMemoryCache(),
  // }),
}

export const ARCHIVE_CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  // [ParachainId.BIFROST_KUSAMA]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.BIFROST_KUSAMA, { useArchive: true }),
  //   cache: new InMemoryCache(),
  // }),
  // [ParachainId.BIFROST_POLKADOT]: new ApolloClient({
  //   ...DEFAULT_CLIENT_OPTIONS,
  //   link: createLink(ParachainId.BIFROST_POLKADOT, { useArchive: true }),
  //   cache: new InMemoryCache(),
  // }),
  [ParachainId.CALAMARI_KUSAMA]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLink(ParachainId.CALAMARI_KUSAMA, { useArchive: true }),
    cache: new InMemoryCache(),
  }),
  [ParachainId.MANTA_STAGING]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLink(ParachainId.MANTA_STAGING, { useArchive: true }),
    cache: new InMemoryCache(),
  }),
}
