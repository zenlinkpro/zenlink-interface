import { Chain, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Button } from '@zenlink-interface/ui'
import type { FC, ReactElement } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import type { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chainId)
    return null

  if (chain?.id !== chainsParachainIdToChainId[chainId]) {
    return (
      <Button onClick={() => switchNetwork && switchNetwork(chainsParachainIdToChainId[chainId])} {...rest}>
        Switch to {Chain.from(chainId).name}
      </Button>
    )
  }

  return <>{children}</>
}
