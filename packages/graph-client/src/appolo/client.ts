import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { createLink } from './link'

export const CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  [ParachainId.MOONRIVER]: new ApolloClient({
    link: createLink(ParachainId.MOONRIVER),
    cache: new InMemoryCache(),
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
  }),
  [ParachainId.MOONBEAM]: new ApolloClient({
    link: createLink(ParachainId.MOONBEAM),
    cache: new InMemoryCache(),
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
  }),
  [ParachainId.ASTAR]: new ApolloClient({
    link: createLink(ParachainId.ASTAR),
    cache: new InMemoryCache(),
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
  }),
  [ParachainId.BIFROST_KUSAMA]: new ApolloClient({
    link: createLink(ParachainId.BIFROST_KUSAMA),
    cache: new InMemoryCache(),
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
  }),
}

export const ARCHIVE_CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  [ParachainId.BIFROST_KUSAMA]: new ApolloClient({
    link: createLink(ParachainId.BIFROST_KUSAMA, { useArchive: true }),
    cache: new InMemoryCache(),
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
  }),
}
