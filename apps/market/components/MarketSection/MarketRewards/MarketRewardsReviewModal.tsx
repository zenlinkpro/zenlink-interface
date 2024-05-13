import { Trans } from '@lingui/macro'
import { Button, Dialog, Dots } from '@zenlink-interface/ui'
import type { YtInterestAndRewardsResult } from '@zenlink-interface/wagmi'
import { useRedeemRewardsReview } from '@zenlink-interface/wagmi'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { YtInterestAndRewards } from './YtInterestAndRewards'

interface MarketRewardsReviewModalProps {
  chainId: number
  ytData: YtInterestAndRewardsResult | undefined
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
}

export const MarketRewardsReviewModal: FC<MarketRewardsReviewModalProps> = ({
  chainId,
  ytData,
  children,
}) => {
  const [open, setOpen] = useState(false)

  const { isWritePending, sendTransaction, routerAddress } = useRedeemRewardsReview({
    chainId,
    setOpen,
    yts: useMemo(() => ytData && [ytData.market.YT], [ytData]),
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Redeem</Trans>} />
          <div className="border rounded-2xl bg-slate-300/40 dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
          <YtInterestAndRewards data={ytData} isError={false} isLoading={false} />
          </div>
          <Button className="mt-4" disabled={isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
            {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Redeem</Trans>}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
