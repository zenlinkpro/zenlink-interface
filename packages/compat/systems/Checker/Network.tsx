import type { FC, ReactElement } from 'react'

import { Checker as WagmiChecker } from '@zenlink-interface/wagmi'
import { Checker as BifrostChecker } from '@zenlink-interface/parachains-bifrost'
import { Checker as AmplitudeChecker } from '@zenlink-interface/parachains-amplitude'
import { ParachainId } from '@zenlink-interface/chain'
import { isEvmNetwork } from '../../config'
import type { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  if (!chainId)
    return null

  if (isEvmNetwork(chainId)) {
    return (
      <WagmiChecker.Network chainId={chainId} {...rest}>
        {children}
      </WagmiChecker.Network>
    )
  }

  if (chainId === ParachainId.AMPLITUDE) {
    return (
      <AmplitudeChecker.Network chainId={chainId} {...rest}>
        {children}
      </AmplitudeChecker.Network>
    )
  }
  else {
    return (
      <BifrostChecker.Network chainId={chainId} {...rest}>
        {children}
      </BifrostChecker.Network>
    )
  }
}
