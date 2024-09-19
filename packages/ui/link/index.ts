import type { FC } from 'react'

import type { ExternalLinkProps } from './External'
import type { InternalLinkProps } from './Internal'
import { External } from './External'
import { Internal } from './Internal'

export interface LinkProps {
  External: FC<ExternalLinkProps>
  Internal: FC<InternalLinkProps>
}

export const Link: LinkProps = { External, Internal }
