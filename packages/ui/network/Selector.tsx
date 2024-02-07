import type { ParachainId } from '@zenlink-interface/chain'
import { chainName } from '@zenlink-interface/chain'
import type { FC, ReactElement } from 'react'
import { useCallback, useMemo } from 'react'

import { NetworkIcon } from '../icons'
import { classNames } from '../index'
import { Tooltip } from '../tooltip'

export interface SelectorProps {
  className?: string
  networks: ParachainId[]
  selectedNetworks: ParachainId[]
  onChange: (selectedNetworks: ParachainId[]) => void
  exclusive?: boolean
  renderer?: (node: JSX.Element) => ReactElement
}

export const Selector: FC<SelectorProps> = ({
  className,
  networks: _networks,
  selectedNetworks,
  onChange,
  exclusive,
  renderer = false,
}) => {
  const networks = useMemo(() => Array.from(new Set(_networks)), [_networks])
  const handleClick = useCallback(
    (chainId: ParachainId) => {
      if (exclusive)
        return onChange([chainId])

      if (networks.every(network => selectedNetworks.includes(network))) {
        // If every network enabled, disable all but incoming chainId
        onChange([chainId])
      }
      else if (selectedNetworks.length === 1 && selectedNetworks[0] === chainId) {
        // If none selected, enable all
        onChange(networks)
      }
      else if (selectedNetworks.includes(chainId)) {
        onChange(selectedNetworks.filter(el => el !== chainId))
      }
      else {
        onChange([...selectedNetworks, chainId])
      }
    },
    [exclusive, networks, onChange, selectedNetworks],
  )

  return (
    <div className="flex flex-wrap gap-2">
      {networks.map((chainId) => {
        const button = (
          <div
            className={classNames(
              className,
              selectedNetworks.includes(chainId) ? 'bg-slate-300 dark:bg-slate-700 border-transparent' : 'border-slate-300 dark:border-slate-800',
              'hover:ring-2 ring-slate-300 dark:ring-slate-800 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 border-2 rounded-xl overflow-hidden cursor-pointer p-2',
            )}
            onClick={() => handleClick(chainId)}
          >
            <NetworkIcon chainId={chainId} height={20} type="circle" width={20} />
          </div>
        )

        return (
          <Tooltip
            content={<div>{chainName[chainId]}</div>}
            key={chainId}
          >
            {typeof renderer === 'function' ? renderer(button) : button}
          </Tooltip>
        )
      })}
    </div>
  )
}
