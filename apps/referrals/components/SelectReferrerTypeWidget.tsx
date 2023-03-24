import { Tab, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { memo } from 'react'
import type { ReferrerType } from 'pages'

interface SelectReferrerTypeWidgetProps {
  referrerType: ReferrerType
  setReferrerType(type: ReferrerType): void
}

export const SelectReferrerTypeWidget: FC<SelectReferrerTypeWidgetProps> = memo(
  ({ referrerType, setReferrerType }) => {
    return (
      <div className="p-3 pt-0">
        <Tab.Group selectedIndex={referrerType} onChange={setReferrerType}>
          <Tab.List className="grid grid-cols-2 mt-2">
            <Tab as="div" className="!h-[unset] p-2">
              <div className="flex flex-col gap-0.5 items-center">
                <Typography variant="sm" weight={500} className="text-slate-800 dark:text-slate-200">
                  Traders
                </Typography>
                <Typography variant="xxs" weight={500} className="text-slate-600 dark:text-slate-400">
                  Get fee discounts
                </Typography>
              </div>
            </Tab>
            <Tab as="div" className="!h-[unset] p-2">
              <div className="flex flex-col gap-0.5 items-center">
                <Typography variant="sm" weight={500} className="text-slate-800 dark:text-slate-200">
                  Affiliates
                </Typography>
                <Typography variant="xxs" weight={500} className="text-slate-600 dark:text-slate-400">
                  Earn rebates
                </Typography>
              </div>
            </Tab>
          </Tab.List>
        </Tab.Group>
      </div>
    )
  },
)
