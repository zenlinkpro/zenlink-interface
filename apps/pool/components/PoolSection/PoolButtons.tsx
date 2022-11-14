import { getAddress } from '@ethersproject/address'
import type { Pair } from '@zenlink-interface/graph-client'
import { ZERO } from '@zenlink-interface/math'
import { Button, Link } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'
interface PoolButtonsProps {
  pair: Pair
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pair }) => {
  const { balance } = usePoolPosition()

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Link.Internal href={`/${pair.id}/remove`} passHref={true} className="flex-1">
          <Button
            disabled={Boolean(balance?.equalTo(ZERO))}
            size="md"
            color="gray"
            fullWidth
          >
            Withdraw
          </Button>
        </Link.Internal>
        <Link.Internal href={`/${pair.id}/add`} passHref={true} className="flex-1">
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
        href={`/swap?token0=${getAddress(pair.token0.id)}&token1=${getAddress(
          pair.token1.id,
        )}&chainId=${pair.chainId}`}
      >
        Trade
      </Button>
    </div>
  )
}
