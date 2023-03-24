import type { FC } from 'react'
import { useCallback, useState } from 'react'
import type { ParachainId } from '@zenlink-interface/chain'
import chains, { chainsChainIdToParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Popover } from '@headlessui/react'
import { DEFAULT_INPUT_UNSTYLED, NetworkIcon, Typography, classNames } from '@zenlink-interface/ui'
import { useSettings } from '@zenlink-interface/shared'
import { useConnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { useWalletState } from '@zenlink-interface/wagmi'
import { SUPPORTED_CHAIN_IDS, isEvmNetwork } from '../../config'

interface NetworkSelectorProps {
  supportedNetworks?: ParachainId[]
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ supportedNetworks = SUPPORTED_CHAIN_IDS }) => {
  const [{ parachainId }, { updateParachainId }] = useSettings()
  const [query, setQuery] = useState('')
  const { chain: evmChain } = useNetwork()
  const { pendingConnector } = useConnect()
  const { notConnected } = useWalletState(!!pendingConnector)
  const { switchNetworkAsync: switchEvmNetworkAsync } = useSwitchNetwork()

  const switchNetwork = useCallback((chainId: ParachainId) => {
    if (isEvmNetwork(chainId)) {
      if (
        notConnected
        || (evmChain && chainsChainIdToParachainId[evmChain.id] === chainId)
      ) {
        updateParachainId(chainId)
      }
      else {
        switchEvmNetworkAsync
        && switchEvmNetworkAsync(chainsParachainIdToChainId[chainId])
          .then(() => updateParachainId(chainId))
      }
    }
    else {
      updateParachainId(chainId)
    }
  }, [evmChain, notConnected, switchEvmNetworkAsync, updateParachainId])

  const isChainActive = useCallback((chainId: ParachainId) => {
    const isParachainIdEqual = parachainId === chainId
    if (!isParachainIdEqual)
      return false
    if (isEvmNetwork(chainId))
      return chainsChainIdToParachainId[evmChain?.id ?? -1] === chainId
    return isParachainIdEqual
  }, [evmChain?.id, parachainId])

  const panel = (
    <Popover.Panel className="flex flex-col w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-md shadow-black/[0.3] bg-white dark:bg-slate-800 border border-slate-500/20 dark:border-slate-200/20">
      <div className="flex gap-2 items-center p-4 pb-3">
        <MagnifyingGlassIcon width={20} height={20} className="text-slate-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'w-full bg-transparent placeholder:font-medium text-base')}
          placeholder="Search networks"
        />
      </div>
      <div className="mx-4 border-b border-slate-500/20 dark:border-slate-200/10" />
      <div className="p-2 max-h-[300px] scroll">
        {supportedNetworks
          .filter(el => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
          .map(el => (
            <div
              onClick={() => { switchNetwork(el) }}
              key={el}
              className="hover:bg-gray-200 hover:dark:bg-slate-700 px-1 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
            >
              <div className="flex items-center gap-2">
                <NetworkIcon
                  type="naked"
                  chainId={el}
                  width={22}
                  height={22}
                  className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                />
                <Typography variant="sm" weight={500} className="text-gray-700 dark:text-slate-300">
                  {chains[el].name}
                </Typography>
              </div>
              {isChainActive(el) && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
            </div>
          ))}
      </div>
    </Popover.Panel>
  )

  return (
    <Popover className="relative">
      {({ open }) => {
        return (
          <>
            <Popover.Button
              className={classNames(
                DEFAULT_INPUT_UNSTYLED,
                'flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] hover:dark:bg-white/[0.08] hover:text-black hover:dark:text-white h-[38px] rounded-xl px-2 pl-3 !font-semibold !text-sm text-slate-800 dark:text-slate-200',
              )}
            >
              <NetworkIcon chainId={parachainId} width={20} height={20} />
              <div className="hidden sm:block">{chains[parachainId]?.name}</div>
              <ChevronDownIcon
                width={20}
                height={20}
                className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
              />
            </Popover.Button>
            {panel}
          </>
        )
      }}
    </Popover>
  )
}
