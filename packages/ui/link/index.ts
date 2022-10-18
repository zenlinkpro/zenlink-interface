import type { FC } from 'react'

import type { ExternalLinkProps } from './External'
import { External } from './External'
import type { InternalLinkProps } from './Internal'
import { Internal } from './Internal'

export interface LinkProps {
  External: FC<ExternalLinkProps>
  Internal: FC<InternalLinkProps>
}

export const Link: LinkProps = { External, Internal }
