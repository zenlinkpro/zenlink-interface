import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Switch, Typography, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { Trans } from '@lingui/macro'
import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { TableFiltersSearchMarket } from './TableFiltersSearchMarket'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const { activeOnly, setFilters } = useMarketFilters()

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap',
          )}
        >
          <TableFiltersSearchMarket />
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl gap-3 px-3 h-[44px]">
            <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
              <Trans>Active</Trans>
            </Typography>
            <Switch
              checked={activeOnly}
              checkedIcon={<CheckIcon className="text-slate-800" />}
              onChange={(checked) => {
                setFilters({ activeOnly: checked })
              }}
              size="sm"
              uncheckedIcon={<XMarkIcon className="text-slate-800" />}
            />
          </div>
        </div>
      </div>
    </>
  )
}
