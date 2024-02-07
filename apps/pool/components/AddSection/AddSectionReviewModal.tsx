import { PlusIcon } from '@heroicons/react/24/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { Price } from '@zenlink-interface/currency'
import { Dialog, Typography } from '@zenlink-interface/ui'
import { Icon } from '@zenlink-interface/ui/currency/Icon'
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

import { t } from '@lingui/macro'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { Rate } from '../Rate'

interface AddSectionReviewModalProps {
  chainId: ParachainId
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  open: boolean
  setOpen: (open: boolean) => void
  children: ReactNode
}

export const AddSectionReviewModal: FC<AddSectionReviewModalProps> = ({
  chainId,
  input0,
  input1,
  open,
  setOpen,
  children,
}) => {
  const [value0, value1] = useTokenAmountDollarValues({ chainId, amounts: [input0, input1] })

  const price = useMemo(() => {
    if (!input0 || !input1)
      return undefined
    return new Price({ baseAmount: input0, quoteAmount: input1 })
  }, [input0, input1])

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <Dialog.Content className="max-w-sm !pb-4">
        <Dialog.Header border={false} onClose={() => setOpen(false)} title={t`Add Liquidity`} />
        <div className="!my-0 grid grid-cols-12 items-center">
          <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-300/40  dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-between w-full gap-2">
                <Typography className="truncate text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                  {input0?.toSignificant(6)}{' '}
                </Typography>
                <div className="flex items-center justify-end gap-2 text-right">
                  {input0 && (
                    <div className="w-5 h-5">
                      <Icon currency={input0.currency} height={20} width={20} />
                    </div>
                  )}
                  <Typography className="text-right text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                    {input0?.currency.symbol}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography className="text-slate-500" variant="sm" weight={500}>
              {value0 ? `$${value0.toFixed(2)}` : '-'}
            </Typography>
          </div>
          <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
            <div className="p-0.5 bg-slate-300 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-800 ring-1 ring-slate-500/20 dark:ring-slate-200/5 z-10 rounded-full">
              <PlusIcon className="text-slate-800 dark:text-slate-200" height={18} width={18} />
            </div>
          </div>
          <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-300/40  dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-between w-full gap-2">
                <Typography className="truncate text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                  {input1?.toSignificant(6)}{' '}
                </Typography>
                <div className="flex items-center justify-end gap-2 text-right">
                  {input1 && (
                    <div className="w-5 h-5">
                      <Icon currency={input1.currency} height={20} width={20} />
                    </div>
                  )}
                  <Typography className="text-right text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                    {input1?.currency.symbol}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography className="text-slate-500" variant="sm" weight={500}>
              {value1 ? `$${value1.toFixed(2)}` : ''}
            </Typography>
          </div>
        </div>
        <div className="flex justify-center p-4">
          <Rate price={price}>
            {({ toggleInvert, content, usdPrice }) => (
              <Typography
                as="button"
                className="flex items-center gap-1 text-slate-900 dark:text-slate-100"
                onClick={() => toggleInvert()}
                variant="sm"
                weight={600}
              >
                {content} {usdPrice && <span className="font-normal text-slate-700 dark:text-slate-300">(${usdPrice})</span>}
              </Typography>
            )}
          </Rate>
        </div>
        {children}
      </Dialog.Content>
    </Dialog>
  )
}
