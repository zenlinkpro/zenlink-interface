import type { FC } from 'react'

import type { AmountsProps } from './Amounts'
import type { ConnectedProps } from './Connected'
import type { CustomProps } from './Custom'
import type { NetworkProps } from './Network'
import { Amounts } from './Amounts'
import { Connected } from './Connected'
import { Custom } from './Custom'
import { Network } from './Network'

export interface CheckerProps {
  Amounts: FC<AmountsProps>
  Connected: FC<ConnectedProps>
  Network: FC<NetworkProps>
  Custom: FC<CustomProps>
}

export const Checker: CheckerProps = { Amounts, Connected, Network, Custom }
