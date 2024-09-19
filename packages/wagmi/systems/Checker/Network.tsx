import type { ParachainId } from '@zenlink-interface/chain'
import type { FC, ReactElement } from 'react'
import type { CheckerButton } from './types'
import { Trans } from '@lingui/macro'
import { Chain, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useSettings } from '@zenlink-interface/shared'
import { Button } from '@zenlink-interface/ui'

import { useCallback } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  const { switchChain } = useSwitchChain()
  const { chain } = useAccount()
  const [, { updateParachainId }] = useSettings()
  const onSwitchNetwork = useCallback((chainId: ParachainId) => {
    updateParachainId(chainId)
    switchChain && switchChain({ chainId: chainsParachainIdToChainId[chainId] })
  }, [switchChain, updateParachainId])

  if (!chainId)
    return null

  if (chain?.id !== chainsParachainIdToChainId[chainId]) {
    return (
      <Button onClick={() => onSwitchNetwork(chainId)} {...rest}>
        <Trans>
          Switch to {Chain.from(chainId).name}
        </Trans>
      </Button>
    )
  }

  return <>{children}</>
}
