import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useIsMounted } from '@zenlink-interface/hooks'
import { useSettings } from '@zenlink-interface/shared'
import { CpuChipIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'
import { useState } from 'react'
import { Overlay, SlideIn, Switch, Tooltip, Typography } from '@zenlink-interface/ui'
import { Trans, t } from '@lingui/macro'

export const AggregatorOverlay: FC = () => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)

  const [{ aggregator }, { updateAggregator }] = useSettings()

  if (!isMounted)
    return <></>

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-between w-full gap-3 group rounded-xl"
      >
        <div className="flex items-center justify-center w-5 h-5">
          <CpuChipIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex items-center justify-between w-full gap-1 py-4">
          <div className="flex items-center gap-1">
            <Typography variant="sm" weight={500}>
              <Trans>Enable Aggregator</Trans>
            </Typography>
            <Tooltip
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <div className="flex flex-col gap-2 w-80">
                  <Typography variant="xs" weight={500}>
                    <Trans>
                      Facilitate cost-efficient and secure swap transactions across multiple liquidity sources.
                    </Trans>
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex gap-1">
            <Typography variant="sm" weight={500} className="hover:text-slate-800 hover:dark:text-slate-200 text-slate-700 dark:text-slate-300">
              {aggregator ? t`On` : t`Off`}
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="hover:text-slate-800 hover:dark:text-slate-200 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content>
          <Overlay.Header onClose={() => setOpen(false)} title={t`Enable Aggregator`} />
          <div className="flex flex-col gap-2 py-3 mx-1 border-b border-slate-200/5">
            <div className="flex items-center justify-between gap-3 mb-1">
              <Typography variant="sm" className="text-slate-900 dark:text-slate-50" weight={500}>
                <Trans>Enable Aggregator</Trans>
              </Typography>
              <Switch checked={aggregator} onChange={() => updateAggregator(!aggregator)} size="sm" />
            </div>
            <Typography variant="xs" weight={400} className="text-slate-500">
              <Trans>
                Facilitate cost-efficient and secure swap transactions across multiple liquidity sources.
              </Trans>
            </Typography>
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </div>
  )
}
