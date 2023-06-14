import type { FC } from 'react'
import { Checker as WagmiChecker } from '@zenlink-interface/wagmi'
import { Checker as BifrostChecker } from '@zenlink-interface/parachains-manta'
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

  return (
    <BifrostChecker.Connected {...rest}>
      {children}
    </BifrostChecker.Connected>
  )
}
