import type { LinkProps } from 'next/link'
import type { FC } from 'react'
import Link from 'next/link'

export type InternalLinkProps = LinkProps & {
  className?: string | undefined
  children?: React.ReactNode
}

export const Internal: FC<InternalLinkProps> = ({ href, ...rest }) => {
  return <Link href={href} {...rest} />
}
