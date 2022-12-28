import { ParachainId } from '@zenlink-interface/chain'
import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import { SQUID_HOST } from '@zenlink-interface/graph-config'

export const ZENLINK_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
  ParachainId.BIFROST_KUSAMA,
]

export const CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
  [ParachainId.ASTAR]: new ApolloClient({
    link: new HttpLink({
      uri: SQUID_HOST[ParachainId.ASTAR],
      fetch,
    }),
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
  [ParachainId.MOONRIVER]: new ApolloClient({
    link: new HttpLink({
      uri: SQUID_HOST[ParachainId.MOONRIVER],
      fetch,
    }),
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
    link: new HttpLink({
      uri: SQUID_HOST[ParachainId.MOONBEAM],
      fetch,
    }),
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
    link: new HttpLink({
      uri: SQUID_HOST[ParachainId.BIFROST_KUSAMA],
      fetch,
    }),
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
