import type { ApolloClientOptions, NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { createLegacyLink, createMarketLink } from './link'

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

export const LEGACY_CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  [ParachainId.MOONRIVER]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.MOONRIVER),
    cache: new InMemoryCache(),
  }),
  [ParachainId.MOONBEAM]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.MOONBEAM),
    cache: new InMemoryCache(),
  }),
  [ParachainId.ASTAR]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.ASTAR),
    cache: new InMemoryCache(),
  }),
  [ParachainId.BIFROST_KUSAMA]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.BIFROST_KUSAMA),
    cache: new InMemoryCache(),
  }),
  [ParachainId.BIFROST_POLKADOT]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.BIFROST_POLKADOT),
    cache: new InMemoryCache(),
  }),
  [ParachainId.ARBITRUM_ONE]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.ARBITRUM_ONE),
    cache: new InMemoryCache(),
  }),
  [ParachainId.BASE]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.BASE),
    cache: new InMemoryCache(),
  }),
  [ParachainId.AMPLITUDE]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.AMPLITUDE),
    cache: new InMemoryCache(),
  }),
  [ParachainId.PENDULUM]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.PENDULUM),
    cache: new InMemoryCache(),
  }),
}

export const ARCHIVE_CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  [ParachainId.BIFROST_KUSAMA]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.BIFROST_KUSAMA, { useArchive: true }),
    cache: new InMemoryCache(),
  }),
  [ParachainId.BIFROST_POLKADOT]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.BIFROST_POLKADOT, { useArchive: true }),
    cache: new InMemoryCache(),
  }),
  [ParachainId.AMPLITUDE]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.AMPLITUDE, { useArchive: true }),
    cache: new InMemoryCache(),
  }),
  [ParachainId.PENDULUM]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createLegacyLink(ParachainId.PENDULUM, { useArchive: true }),
    cache: new InMemoryCache(),
  }),
}

export const MARKET_CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  [ParachainId.MOONBEAM]: new ApolloClient({
    ...DEFAULT_CLIENT_OPTIONS,
    link: createMarketLink(ParachainId.MOONBEAM),
    cache: new InMemoryCache(),
  }),
}
