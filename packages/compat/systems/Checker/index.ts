import type { FC } from 'react'

import { Amounts } from './Amounts'
import type { AmountsProps } from './Amounts'
import type { ConnectedProps } from './Connected'
import { Connected } from './Connected'
import type { CustomProps } from './Custom'
import { Custom } from './Custom'
import type { NetworkProps } from './Network'
import { Network } from './Network'

export interface CheckerProps {
  Amounts: FC<AmountsProps>
  Connected: FC<ConnectedProps>
  Network: FC<NetworkProps>
  Custom: FC<CustomProps>
}

export const Checker: CheckerProps = { Amounts, Connected, Network, Custom }
