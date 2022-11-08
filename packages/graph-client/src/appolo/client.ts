import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ParachainId } from '@zenlink-interface/chain'
import { SQUID_HOST } from '@zenlink-interface/graph-config'
import fetch from 'cross-fetch'

export const CLIENTS: Record<number | string, ApolloClient<NormalizedCacheObject>> = {
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
}
