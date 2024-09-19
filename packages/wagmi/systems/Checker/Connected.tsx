import type { FC } from 'react'
import type { CheckerButton } from './types'
import { Trans } from '@lingui/macro'
import { useIsMounted } from '@zenlink-interface/hooks'

import { useAccount } from 'wagmi'
import { Wallet } from '../../components'

export const Connected: FC<CheckerButton> = ({ children, ...rest }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address) {
    return (
      <Wallet.Button appearOnMount={false} {...rest}>
        <Trans>Connect Wallet</Trans>
      </Wallet.Button>
    )
  }

  return <>{children}</>
}
