import { CheckIcon, XCircleIcon } from '@heroicons/react/24/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import chains from '@zenlink-interface/chain'
import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import { NetworkIcon, Typography, classNames } from '..'
import { Select } from '../select'

export interface SelectorMenuProps {
  className?: string
  networks: ParachainId[]
  selectedNetworks: ParachainId[]
  onChange(selectedNetworks: ParachainId[]): void
}

export const SelectorMenu: FC<SelectorMenuProps> = ({ networks, selectedNetworks, onChange }) => {
  const value = networks.length === selectedNetworks.length ? [] : selectedNetworks

  return (
    <Select
      value={value}
      onChange={(values: ParachainId[]) => onChange(values.length === 0 ? networks : values)}
      button={
        <Select.Button className="ring-offset-slate-100 dark:ring-offset-slate-900">
          <Typography variant="sm" weight={600} className="flex gap-2 items-center text-slate-800 dark:text-slate-200">
            {value.length === 0
              ? (
                  <>
                    <CheckIcon width={20} height={20} className="text-green-600 dark:text-green" /> <Trans>All Networks</Trans>
                  </>
                )
              : (
                  <>
                    <XCircleIcon
                      onClick={() => onChange(networks)}
                      width={20}
                      height={20}
                      className="hover:text-slate-600 hover:dark:text-slate-400 text-slate-500"
                    />{' '}
                    <Trans>{value.length} Selected</Trans>
                  </>
                )}
          </Typography>
        </Select.Button>
      }
      multiple
    >
      <Select.Options className="w-fit">
        {networks.map(network => (
          <Select.Option key={network} value={network} showArrow={false}>
            <div className="grid grid-cols-[auto_26px] gap-3 items-center w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5">
                  <NetworkIcon type="circle" chainId={network} width={20} height={20} />
                </div>
                <Typography
                  variant="sm"
                  weight={600}
                  className={classNames(
                    selectedNetworks.includes(network) && selectedNetworks.length !== networks.length
                      ? 'text-slate-900 dark:text-slate-50'
                      : 'text-slate-600 dark:text-slate-400',
                  )}
                >
                  {chains[network].name}
                </Typography>
              </div>
              <div className="flex justify-end">
                {selectedNetworks.includes(network) && selectedNetworks.length !== networks.length
                  ? <CheckIcon width={20} height={20} className="text-blue" />
                  : <></>}
              </div>
            </div>
          </Select.Option>
        ))}
      </Select.Options>
    </Select>
  )
}
