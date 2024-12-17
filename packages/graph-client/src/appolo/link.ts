import type { ApolloLink } from '@apollo/client'
import { createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { ARCHIVE_HOST, LEGACY_SQUID_HOST, MARKET_SQUID_HOST } from '@zenlink-interface/graph-config'
import { Kind, OperationTypeNode } from 'graphql'

function createSplitLink(host: string): ApolloLink | undefined {
  // due to Next.js SSR environment
  const httpLink = host
    ? createHttpLink({ uri: host })
    : undefined

  return httpLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query)
          return (
            def.kind === Kind.OPERATION_DEFINITION
            && def.operation === OperationTypeNode.QUERY
          )
        },
        httpLink,
      )
    : undefined
}

interface CreateLinkOption {
  useArchive: boolean
}

export function createLegacyLink(
  chainId: number,
  option: CreateLinkOption = { useArchive: false },
): ApolloLink | undefined {
  return createSplitLink(
    option.useArchive ? ARCHIVE_HOST[chainId] : LEGACY_SQUID_HOST[chainId],
  )
}

export function createMarketLink(chainId: number): ApolloLink | undefined {
  return createSplitLink(MARKET_SQUID_HOST[chainId])
}
