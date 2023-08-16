import type { Amount, Currency } from '@zenlink-interface/currency'
import type { FC } from 'react'
import type { Permit2Actions } from '@zenlink-interface/wagmi'
import { Approve as WagmiApprove } from '@zenlink-interface/wagmi'
import { Approve as BifrostApprove } from '@zenlink-interface/parachains-bifrost'
import { isEvmNetwork } from '../../config'
import type { ApprovalButtonRenderProp, ApproveButton } from './types'

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
        permit2Actions={permit2Actions}
        setPermit2Actions={setPermit2Actions}
        enablePermit2={enablePermit2}
        {...props}
      />
    )
  }

  return <BifrostApprove.Token />
}
