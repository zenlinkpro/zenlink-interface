import type { Pool } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { t, Trans } from '@lingui/macro'
import { formatUSD } from '@zenlink-interface/format'
import { useTokensFromPool } from '@zenlink-interface/shared'

import { Currency, Dialog, Typography } from '@zenlink-interface/ui'
import { usePoolPositionStaked } from 'components/PoolPositionStakedProvider'
import { useCallback } from 'react'
import { usePoolPosition } from '../../PoolPositionProvider'
import { PoolButtons } from '../PoolButtons'

interface PoolActionBarPositionDialogProps {
  pool: Pool
  open: boolean
  setOpen: (open: boolean) => void
}

export const PoolActionBarPositionDialog: FC<PoolActionBarPositionDialogProps> = ({ pool, open, setOpen }) => {
  const { tokens } = useTokensFromPool(pool)
  const { underlyings, values, isError, isLoading, balance } = usePoolPosition()

  const {
    balance: stakedBalance,
    underlyings: farmUnderlyings,
    values: farmValues,
    isLoading: isStakedLoading,
    isError: isStakedError,
  } = usePoolPositionStaked()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog onClose={handleClose} open={open}>
      <Dialog.Content className="!pb-6">
        <Dialog.Header onClose={handleClose} title={t`My Position`} />
        {isLoading && !isError && !balance
          ? (
              <div className="flex flex-col gap-2 px-2 py-4 mt-2">
                <div className="grid justify-between grid-cols-10 gap-10 mb-2">
                  <div className="h-[20px] bg-slate-400 dark:bg-slate-600 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-400 dark:bg-slate-600 animate-pulse col-span-2 rounded-full" />
                </div>
                <div className="grid justify-between grid-cols-10 gap-10">
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
                <div className="grid justify-between grid-cols-10 gap-10">
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
              </div>
            )
          : (
              <>
                <div className="flex items-center justify-between p-2 pt-4">
                  <Typography className="text-slate-900 dark:text-slate-100" variant="sm" weight={600}>
                    <Trans>Unstaked Position</Trans>
                  </Typography>
                  <div className="flex flex-col">
                    <Typography className="text-right text-slate-900 dark:text-slate-100" variant="xs" weight={500}>
                      {formatUSD(values.reduce((total, current) => total + current, 0))}
                    </Typography>
                  </div>
                </div>
                {tokens.map((token, i) => (
                  <div className="flex justify-between px-2 py-1" key={token.wrapped.address}>
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={token} height={20} width={20} />
                      <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                        {underlyings[i]?.toSignificant(6)} {token.symbol}
                      </Typography>
                    </div>
                    <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
                      {formatUSD(values[i])}
                    </Typography>
                  </div>
                ))}
              </>
            )}

        {isStakedLoading && !isStakedError && !stakedBalance
          ? (
              <div className="flex flex-col gap-2 px-2 py-4 mt-2">
                <div className="grid justify-between grid-cols-10 gap-10 mb-2">
                  <div className="h-[20px] bg-slate-400 dark:bg-slate-600 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-400 dark:bg-slate-600 animate-pulse col-span-2 rounded-full" />
                </div>
                <div className="grid justify-between grid-cols-10 gap-10">
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
                <div className="grid justify-between grid-cols-10 gap-10">
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-300 dark:bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
              </div>
            )
          : (
              <>
                <div className="flex items-center justify-between p-2 pt-4">
                  <Typography className="text-slate-900 dark:text-slate-100" variant="sm" weight={600}>
                    <Trans>Staked Position</Trans>
                  </Typography>
                  <div className="flex flex-col">
                    <Typography className="text-right text-slate-900 dark:text-slate-100" variant="xs" weight={500}>
                      {formatUSD(farmValues.reduce((total, current) => total + current, 0))}
                    </Typography>
                  </div>
                </div>
                {tokens.map((token, i) => (
                  <div className="flex justify-between px-2 py-1" key={token.wrapped.address}>
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={token} height={20} width={20} />
                      <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                        {farmUnderlyings[i]?.toSignificant(6)} {token.symbol}
                      </Typography>
                    </div>
                    <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
                      {formatUSD(farmValues[i])}
                    </Typography>
                  </div>
                ))}
              </>
            )}
        <div className="px-2 mt-3">
          <PoolButtons pool={pool} />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
