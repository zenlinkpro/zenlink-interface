import type { FC } from 'react'
import type { CheckerButton } from './types'
import { useIsMounted } from '@zenlink-interface/hooks'

import { useAccount } from '@zenlink-interface/polkadot'
import { Wallet } from '../../components'

export const Connected: FC<CheckerButton> = ({ children, ...rest }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address) {
    return (
      <Wallet.Button appearOnMount={false} {...rest}>
        Connect Wallet
      </Wallet.Button>
    )
  }

  return <>{children}</>
}
