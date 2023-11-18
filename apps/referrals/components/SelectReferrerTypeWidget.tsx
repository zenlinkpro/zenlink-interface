import { Tab, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { memo } from 'react'
import type { ReferrerType } from 'pages'
import { Trans } from '@lingui/macro'

interface SelectReferrerTypeWidgetProps {
  referrerType: ReferrerType
  setReferrerType(type: ReferrerType): void
}

export const SelectReferrerTypeWidget: FC<SelectReferrerTypeWidgetProps> = memo(
  function SelectReferrerTypeWidget({ referrerType, setReferrerType }) {
    return (
      <div className="p-3 pt-0">
        <Tab.Group onChange={setReferrerType} selectedIndex={referrerType}>
          <Tab.List className="grid grid-cols-2 mt-2">
            <Tab as="div" className="!h-[unset] p-2">
              <div className="flex flex-col gap-0.5 items-center">
                <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={500}>
                  <Trans>Traders</Trans>
                </Typography>
                <Typography className="text-slate-600 dark:text-slate-400" variant="xxs" weight={500}>
                  <Trans>Get fee discounts</Trans>
                </Typography>
              </div>
            </Tab>
            <Tab as="div" className="!h-[unset] p-2">
              <div className="flex flex-col gap-0.5 items-center">
                <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={500}>
                  <Trans>Affiliates</Trans>
                </Typography>
                <Typography className="text-slate-600 dark:text-slate-400" variant="xxs" weight={500}>
                  <Trans>Earn rebates</Trans>
                </Typography>
              </div>
            </Tab>
          </Tab.List>
        </Tab.Group>
      </div>
    )
  },
)
