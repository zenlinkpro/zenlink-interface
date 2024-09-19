import type { Amount, Currency } from '@zenlink-interface/currency'
import type { Permit2Actions } from '@zenlink-interface/wagmi'
import type { FC } from 'react'
import type { ApprovalButtonRenderProp, ApproveButton } from './types'
import { ParachainId } from '@zenlink-interface/chain'
import { Approve as AmplitudeApprove } from '@zenlink-interface/parachains-amplitude'
import { Approve as BifrostApprove } from '@zenlink-interface/parachains-bifrost'
import { Approve as WagmiApprove } from '@zenlink-interface/wagmi'
import { isEvmNetwork } from '../../config'

type RenderPropPayload = ApprovalButtonRenderProp

export interface TokenApproveButtonProps extends ApproveButton<RenderPropPayload> {
  chainId: number | undefined
  watch?: boolean
  amount?: Amount<Currency>
  address?: string
  enablePermit2?: boolean
  permit2Actions?: Permit2Actions
  setPermit2Actions?: (actions: Permit2Actions) => void
}

export const TokenApproveButton: FC<TokenApproveButtonProps> = ({
  chainId,
  enablePermit2,
  permit2Actions,
  setPermit2Actions,
  ...props
}) => {
  if (!chainId)
    return <></>
  if (isEvmNetwork(chainId)) {
    return (
      <WagmiApprove.Token
        enablePermit2={enablePermit2}
        permit2Actions={permit2Actions}
        setPermit2Actions={setPermit2Actions}
        {...props}
      />
    )
  }

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
    return <AmplitudeApprove.Token />
  else
    return <BifrostApprove.Token />
}
