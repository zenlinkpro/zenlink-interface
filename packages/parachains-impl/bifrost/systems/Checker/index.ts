import type { FC } from 'react'

import type { AmountsProps } from './Amounts'
import type { NetworkProps } from './Network'
import type { CheckerButton } from './types'
import { Amounts } from './Amounts'
import { Connected } from './Connected'
import { Network } from './Network'

export interface CheckerProps {
  Amounts: FC<AmountsProps>
  Connected: FC<CheckerButton>
  Network: FC<NetworkProps>
}

export const Checker: CheckerProps = { Amounts, Connected, Network }
