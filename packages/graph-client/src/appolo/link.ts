import type { ApolloLink } from '@apollo/client'
import { createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { ARCHIVE_HOST, SQUID_HOST } from '@zenlink-interface/graph-config'
import { Kind, OperationTypeNode } from 'graphql'
import fetch from 'cross-fetch'

interface CreateLinkOption {
  useArchive: boolean
}

export function createLink(
  chainId: number,
  option: CreateLinkOption = { useArchive: false },
): ApolloLink | undefined {
  const host = option.useArchive ? ARCHIVE_HOST[chainId] : SQUID_HOST[chainId]

  // due to Next.js SSR environment
  const httpLink = host
    ? createHttpLink({ uri: host, fetch: typeof window !== 'undefined' ? undefined : fetch })
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
