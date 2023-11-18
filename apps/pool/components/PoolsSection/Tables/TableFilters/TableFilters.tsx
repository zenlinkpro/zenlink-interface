import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Network, Select, Switch, Typography, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { usePoolFilters } from 'components/PoolsFiltersProvider'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { Trans } from '@lingui/macro'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const { selectedNetworks, selectedPoolTypes, incentivizedOnly, setFilters } = usePoolFilters()
  const poolTypesValue
    = Object.keys(AVAILABLE_POOL_TYPE_MAP).length === selectedPoolTypes.length ? [] : selectedPoolTypes

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <Network.SelectorMenu
          networks={SUPPORTED_CHAIN_IDS}
          onChange={selectedNetworks => setFilters({ selectedNetworks })}
          selectedNetworks={selectedNetworks}
        />
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap',
          )}
        >
          <Select
            button={(
              <Select.Button className="ring-offset-slate-100 dark:ring-offset-slate-900">
                <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
                  <Trans>Pool Types</Trans>
                </Typography>
              </Select.Button>
            )}
            multiple
            onChange={(values: string[]) =>
              setFilters({ selectedPoolTypes: values.length === 0 ? Object.keys(AVAILABLE_POOL_TYPE_MAP) : values })}
            value={poolTypesValue}
          >
            <Select.Options className="w-fit">
              {Object.entries(AVAILABLE_POOL_TYPE_MAP).map(([k, v]) => (
                <Select.Option className="cursor-pointer" key={k} showArrow={false} value={k}>
                  <div className="grid grid-cols-[auto_26px] gap-3 items-center w-full">
                    <div className="flex items-center gap-2.5">
                      <Typography
                        className={classNames(
                          selectedPoolTypes.includes(k)
                          && selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length
                            ? 'text-slate-900 dark:text-slate-50'
                            : 'text-slate-600 dark:text-slate-400',
                        )}
                        variant="sm"
                        weight={600}
                      >
                        {v}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      {selectedPoolTypes.includes(k)
                      && selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length
                        ? <CheckIcon className="text-blue" height={20} width={20} />
                        : <></>}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select.Options>
          </Select>
          <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-xl gap-3 px-3 h-[44px]">
            <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
              <Trans>Farms</Trans>
            </Typography>
            <Switch
              checked={incentivizedOnly}
              checkedIcon={<CheckIcon className="text-slate-800" />}
              onChange={(checked) => {
                setFilters({ incentivizedOnly: checked })
              }}
              size="sm"
              uncheckedIcon={<XMarkIcon className="text-slate-800" />}
            />
          </div>
          <TableFiltersSearchToken />
        </div>
      </div>
    </>
  )
}
