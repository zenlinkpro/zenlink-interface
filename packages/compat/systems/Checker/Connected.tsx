import type { FC } from 'react'
import { ParachainId } from '@zenlink-interface/chain'
import { Checker as WagmiChecker } from '@zenlink-interface/wagmi'
import { Checker as BifrostChecker } from '@zenlink-interface/parachains-bifrost'
import { Checker as AmplitudeChecker } from '@zenlink-interface/parachains-amplitude'
import { isEvmNetwork } from '../../config'
import type { CheckerButton } from './types'

export interface ConnectedProps extends CheckerButton {
  chainId: number | undefined
}

export const Connected: FC<ConnectedProps> = ({ children, chainId, ...rest }) => {
  if (chainId && isEvmNetwork(chainId)) {
    return (
      <WagmiChecker.Connected {...rest}>
        {children}
      </WagmiChecker.Connected>
    )
  }

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM) {
    return (
      <AmplitudeChecker.Connected {...rest}>
        {children}
      </AmplitudeChecker.Connected>
    )
  }
  else {
    return (
      <BifrostChecker.Connected {...rest}>
        {children}
      </BifrostChecker.Connected>
    )
  }
}
