import type { Amount, Type } from '@zenlink-interface/currency'
import type { FC } from 'react'

import type { CheckerButton } from './types'
import { ParachainId } from '@zenlink-interface/chain'
import { Checker as AmplitudeChecker } from '@zenlink-interface/parachains-amplitude'
import { Checker as BifrostChecker } from '@zenlink-interface/parachains-bifrost'
import { Checker as WagmiChecker } from '@zenlink-interface/wagmi'
import { isEvmNetwork } from '../../config'

export interface AmountsProps extends CheckerButton {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

export const Amounts: FC<AmountsProps> = ({
  chainId,
  children,
  ...rest
}) => {
  if (chainId && isEvmNetwork(chainId)) {
    return (
      <WagmiChecker.Amounts chainId={chainId} {...rest}>
        {children}
      </WagmiChecker.Amounts>
    )
  }

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM) {
    return (
      <AmplitudeChecker.Amounts chainId={chainId} {...rest}>
        {children}
      </AmplitudeChecker.Amounts>
    )
  }
  else {
    return (
      <BifrostChecker.Amounts chainId={chainId} {...rest}>
        {children}
      </BifrostChecker.Amounts>
    )
  }
}
