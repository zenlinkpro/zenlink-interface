import type { Amount, Currency } from '@zenlink-interface/currency'
import type { FC } from 'react'
import { Approve as WagmiApprove } from '@zenlink-interface/wagmi'
import { Approve as BifrostApprove } from '@zenlink-interface/parachains-manta'
import { isEvmNetwork } from '../../config'
import type { ApprovalButtonRenderProp, ApproveButton } from './types'

type RenderPropPayload = ApprovalButtonRenderProp

export interface TokenApproveButtonProps extends ApproveButton<RenderPropPayload> {
  chainId: number | undefined
  watch?: boolean
  amount?: Amount<Currency>
  address?: string
}

export const TokenApproveButton: FC<TokenApproveButtonProps> = ({ chainId, ...props }) => {
  if (!chainId)
    return <></>
  if (isEvmNetwork(chainId))
    return <WagmiApprove.Token {...props} />

  return <BifrostApprove.Token />
}
