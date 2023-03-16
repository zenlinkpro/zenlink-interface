import type { FC } from 'react'

import { Amounts } from './Amounts'
import type { AmountsProps } from './Amounts'
import { Connected } from './Connected'
import type { CheckerButton } from './types'
import type { NetworkProps } from './Network'
import { Network } from './Network'

export interface CheckerProps {
  Amounts: FC<AmountsProps>
  Connected: FC<CheckerButton>
  Network: FC<NetworkProps>
}

export const Checker: CheckerProps = { Amounts, Connected, Network }
