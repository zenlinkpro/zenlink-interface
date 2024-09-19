import type { Pool } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { Trans } from '@lingui/macro'
import { ZERO } from '@zenlink-interface/math'

import { useTokensFromPool } from '@zenlink-interface/shared'
import { Button, Link } from '@zenlink-interface/ui'
import { usePoolPositionStaked } from 'components/PoolPositionStakedProvider'
import { usePoolPosition } from '../PoolPositionProvider'

interface PoolButtonsProps {
  pool: Pool
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pool }) => {
  const { balance } = usePoolPosition()
  const { balance: stakedBalance } = usePoolPositionStaked()
  const { tokens } = useTokensFromPool(pool)

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Link.Internal className="flex-1" href={`/${pool.id}/remove`} passHref={true}>
          <Button
            color="gray"
            disabled={Boolean(balance?.equalTo(ZERO) && stakedBalance?.equalTo(ZERO))}
            fullWidth
            size="md"
          >
            <Trans>Withdraw</Trans>
          </Button>
        </Link.Internal>
        <Link.Internal className="flex-1" href={`/${pool.id}/add`} passHref={true}>
          <Button as="button" fullWidth size="md">
            <Trans>Deposit</Trans>
          </Button>
        </Link.Internal>
      </div>
      <Button
        as="a"
        className="col-span-2"
        href={`/swap?token0=${tokens[0]?.wrapped.address ?? ''}&token1=${tokens[1]?.wrapped.address ?? ''}&chainId=${pool.chainId}`}
        size="md"
        variant="outlined"
      >
        <Trans>Trade</Trans>
      </Button>
    </div>
  )
}
