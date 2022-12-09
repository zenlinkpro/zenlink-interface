import type { ApolloLink } from '@apollo/client'
import { HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { ARCHIVE_HOST, SQUID_HOST } from '@zenlink-interface/graph-config'
import { Kind, OperationTypeNode } from 'graphql'

interface CreateLinkOption {
  useArchive: boolean
}

export function createLink(
  chainId: number,
  option: CreateLinkOption = { useArchive: false },
): ApolloLink | undefined {
  const host = option.useArchive ? ARCHIVE_HOST[chainId] : SQUID_HOST[chainId]

  const httpLink = host
    ? new HttpLink({ uri: host })
    : undefined

  // due to Next.js SSR environment
  return typeof window !== 'undefined' && httpLink
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
    : httpLink
}
