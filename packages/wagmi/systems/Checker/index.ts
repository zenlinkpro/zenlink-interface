import type { FC } from 'react'

import type { AmountsProps } from './Amounts'
import { Amounts } from './Amounts'
import { Connected } from './Connected'
import type { CustomProps } from './Custom'
import { Custom } from './Custom'
import type { NetworkProps } from './Network'
import { Network } from './Network'
import type { CheckerButton } from './types'

export interface CheckerProps {
  Amounts: FC<AmountsProps>
  Connected: FC<CheckerButton>
  Network: FC<NetworkProps>
  Custom: FC<CustomProps>
}

export const Checker: CheckerProps = { Amounts, Connected, Network, Custom }
