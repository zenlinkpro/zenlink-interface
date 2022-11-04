import { ParachainId } from '@zenlink-interface/chain'
import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'

export const ZENLINK_CHAINS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
]

const SQUID_HOST_ENDPOINT = 'https://squid.subsquid.io'

export const SQUID_HOST: Record<number | string, string> = {
  [ParachainId.ASTAR]: `${SQUID_HOST_ENDPOINT}/Zenlink-Astar-Squid/graphql`,
  [ParachainId.MOONRIVER]: `${SQUID_HOST_ENDPOINT}/zenlink-moonriver-squid/graphql`,
}

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
}
