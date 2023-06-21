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
          selectedNetworks={selectedNetworks}
          onChange={selectedNetworks => setFilters({ selectedNetworks })}
        />
        <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-xl gap-3 px-3 h-[44px]">
          <Typography variant="sm" weight={600} className="text-slate-800 dark:text-slate-200">
            <Trans>Farms</Trans>
          </Typography>
          <Switch
            checked={incentivizedOnly}
            onChange={(checked) => {
              setFilters({ incentivizedOnly: checked })
            }}
            size="sm"
            uncheckedIcon={<XMarkIcon className="text-slate-800" />}
            checkedIcon={<CheckIcon className="text-slate-800" />}
          />
        </div>
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap',
          )}
        >
          {/* <Select
            value={poolTypesValue}
            onChange={(values: string[]) =>
              setFilters({ selectedPoolTypes: values.length === 0 ? Object.keys(AVAILABLE_POOL_TYPE_MAP) : values })
            }
            button={
              <Select.Button className="ring-offset-slate-100 dark:ring-offset-slate-900">
                <Typography variant="sm" weight={600} className="text-slate-800 dark:text-slate-200">
                  <Trans>Pool Types</Trans>
                </Typography>
              </Select.Button>
            }
            multiple
          >
            <Select.Options className="w-fit">
              {Object.entries(AVAILABLE_POOL_TYPE_MAP).map(([k, v]) => (
                <Select.Option key={k} value={k} showArrow={false} className="cursor-pointer">
                  <div className="grid grid-cols-[auto_26px] gap-3 items-center w-full">
                    <div className="flex items-center gap-2.5">
                      <Typography
                        variant="sm"
                        weight={600}
                        className={classNames(
                          selectedPoolTypes.includes(k)
                            && selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length
                            ? 'text-slate-900 dark:text-slate-50'
                            : 'text-slate-600 dark:text-slate-400',
                        )}
                      >
                        {v}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      {selectedPoolTypes.includes(k)
                        && selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length
                        ? <CheckIcon width={20} height={20} className="text-blue" />
                        : <></>
                      }
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select.Options>
          </Select> */}
          <TableFiltersSearchToken />
        </div>
      </div>
    </>
  )
}
