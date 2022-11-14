import { formatUSD } from '@zenlink-interface/format'
import type { Pair } from '@zenlink-interface/graph-client'
import { Currency, Dialog, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { usePoolPosition } from '../../PoolPositionProvider'
import { PoolButtons } from '../PoolButtons'

interface PoolActionBarPositionDialogProps {
  pair: Pair
  open: boolean
  setOpen(open: boolean): void
}

export const PoolActionBarPositionDialog: FC<PoolActionBarPositionDialogProps> = ({ pair, open, setOpen }) => {
  const { token0, token1 } = useTokensFromPair(pair)
  const { balance, isError, isLoading, value0, value1, underlying1, underlying0 } = usePoolPosition()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog onClose={handleClose} open={open}>
      <Dialog.Content className="!pb-6">
        <Dialog.Header title="My Position" onClose={handleClose} />
        {isLoading && !isError && !balance
          ? (
            <div className="flex flex-col gap-2 px-2 py-4 mt-2">
              <div className="grid justify-between grid-cols-10 gap-10 mb-2">
                <div className="h-[20px] bg-slate-600 animate-pulse col-span-8 rounded-full" />
                <div className="h-[20px] bg-slate-600 animate-pulse col-span-2 rounded-full" />
              </div>
              <div className="grid justify-between grid-cols-10 gap-10">
                <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
                <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
              </div>
              <div className="grid justify-between grid-cols-10 gap-10">
                <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
                <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
              </div>
            </div>
            )
          : (
            <>
              <div className="flex items-center justify-between p-2 pt-4">
                <Typography variant="sm" weight={600} className="text-slate-100">
                  My Position
                </Typography>
                <div className="flex flex-col">
                  <Typography variant="xs" weight={500} className="text-right text-slate-100">
                    {formatUSD(value0 + value1)}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <Currency.Icon currency={token0} width={20} height={20} />
                  <Typography variant="sm" weight={500} className="text-slate-300">
                    {underlying0?.toSignificant(6)} {token0.symbol}
                  </Typography>
                </div>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  {formatUSD(value0)}
                </Typography>
              </div>
              <div className="flex justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <Currency.Icon currency={token1} width={20} height={20} />
                  <Typography variant="sm" weight={500} className="text-slate-300">
                    {underlying1?.toSignificant(6)} {token1.symbol}
                  </Typography>
                </div>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  {formatUSD(value1)}
                </Typography>
              </div>
            </>
            )}

        <div className="px-2 mt-3">
          <PoolButtons pair={pair} />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
