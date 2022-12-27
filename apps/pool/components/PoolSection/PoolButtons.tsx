import type { Pool } from '@zenlink-interface/graph-client'
import { ZERO } from '@zenlink-interface/math'
import { Button, Link } from '@zenlink-interface/ui'
import { useTokensFromPool } from 'lib/hooks'
import type { FC } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'
interface PoolButtonsProps {
  pool: Pool
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pool }) => {
  const { balance } = usePoolPosition()
  const { tokens } = useTokensFromPool(pool)

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Link.Internal href={`/${pool.id}/remove`} passHref={true} className="flex-1">
          <Button
            disabled={Boolean(balance?.equalTo(ZERO))}
            size="md"
            color="gray"
            fullWidth
          >
            Withdraw
          </Button>
        </Link.Internal>
        <Link.Internal href={`/${pool.id}/add`} passHref={true} className="flex-1">
          <Button as="button" size="md" fullWidth>
            Deposit
          </Button>
        </Link.Internal>
      </div>
      <Button
        className="col-span-2"
        size="md"
        variant="outlined"
        as="a"
        href={`/swap?token0=${tokens[0].wrapped.address}&token1=${tokens[1].wrapped.address}&chainId=${pool.chainId}`}
      >
        Trade
      </Button>
    </div>
  )
}
