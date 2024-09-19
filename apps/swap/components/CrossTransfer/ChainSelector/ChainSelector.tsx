import type { FC } from 'react'
import type { NetworkSelectorOnSelectCallback } from '../NetworkSelector'
import { Popover } from '@headlessui/react'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { classNames, Typography } from '@zenlink-interface/ui'
import React, { useCallback } from 'react'
import { CHAIN_META } from '../config/chain'
import { NetworkIcon } from '../icons/NetworkIcon'
import { NetworkSelector } from '../NetworkSelector'

interface ChainSelectorsProps {
  open: boolean
  network0: string
  network1: string
  networkList0: string[]
  networkList1: string[]
  setNetwork0: (el: string) => void
  setNetwork1: (el: string) => void
  switchChains: () => void
}

export const ChainSelectors: FC<ChainSelectorsProps> = ({
  network0,
  network1,
  networkList0 = [],
  networkList1 = [],
  setNetwork0,
  setNetwork1,
  switchChains,
  open,
}) => {
  const handleSelect0 = useCallback<NetworkSelectorOnSelectCallback<string>>(
    (el, close) => {
      setNetwork0(el)
      close()
    },
    [setNetwork0],
  )

  const handleSelect1 = useCallback<NetworkSelectorOnSelectCallback<string>>(
    (el, close) => {
      setNetwork1(el)
      close()
    },
    [setNetwork1],
  )

  return (
    <div className={classNames(open ? '' : 'hidden', 'pt-3')}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="z-10 group hover:bg-white/30 hover:dark:bg-white/[0.16] p-2 border-white transition-all rounded-full cursor-pointer"
            onClick={switchChains}
            type="button"
          >
            <div className="transition-transform rotate-0 group-hover:rotate-180">
              <ArrowRightIcon className="w-4 h-4 text-blue" strokeWidth={3} />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-[60px] border-gray-200 dark:border-slate-800">
          <div className="z-10">
            <NetworkSelector<string>
              networks={networkList0}
              onSelect={handleSelect0}
              selected={network0}
              variant="dialog"
            >
              <Popover.Button
                as="button"
                className="transition-[background] gap-2 bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.08] hover:dark:bg-white/[0.08] pl-2 pr-3 font-medium flex flex-col rounded-xl py-1.5 w-full"
              >
                <Typography className="px-1 pt-0.5" variant="xxs">
                  <Trans>From</Trans>
                </Typography>
                <div className="flex items-center justify-between w-full">
                  {network0
                    ? (
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <NetworkIcon
                            chain={CHAIN_META[network0]?.chain}
                            className="bg-black/10 dark:bg-white/10 rounded-full"
                            height={28}
                            type="naked"
                            width={28}
                          />
                          <Typography className="truncate" weight={500}>
                            {CHAIN_META[network0]?.name}
                          </Typography>
                        </div>
                      )
                    : (
                        <div className="flex items-center gap-1.5 overflow-hidden h-7">
                          <Typography className="truncate" weight={500}>
                            <Trans>Select Network</Trans>
                          </Typography>
                        </div>
                      )}
                  <div className="min-w-4 min-h-4">
                    <ChevronDownIcon height={16} strokeWidth={3} width={16} />
                  </div>
                </div>
              </Popover.Button>
            </NetworkSelector>
          </div>
          <div className="z-10">
            <NetworkSelector
              networks={networkList1}
              onSelect={handleSelect1}
              selected={network1}
              variant="dialog"
            >
              <Popover.Button
                as="button"
                className="transition-[background] gap-2 bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.08] hover:dark:bg-white/[0.08] pl-2 pr-3 font-medium flex flex-col rounded-xl py-1.5 w-full"
              >
                <Typography className="px-1 pt-0.5" variant="xxs">
                  <Trans>To</Trans>
                </Typography>
                <div className="flex items-center justify-between w-full">
                  {network1
                    ? (
                        <div className="flex items-center justify-start gap-1.5 overflow-hidden">
                          <NetworkIcon
                            chain={CHAIN_META[network1]?.chain}
                            className="bg-black/10 dark:bg-white/10 rounded-full"
                            height={28}
                            type="naked"
                            width={28}
                          />
                          <Typography className="truncate" weight={500}>
                            {CHAIN_META[network1]?.name}
                          </Typography>
                        </div>
                      )
                    : (
                        <div className="flex items-center gap-1.5 overflow-hidden h-7">
                          <Typography className="truncate" weight={500}>
                            <Trans>Select Network</Trans>
                          </Typography>
                        </div>
                      )}
                  <div className="min-w-4 min-h-4">
                    <ChevronDownIcon height={16} strokeWidth={3} width={16} />
                  </div>
                </div>
              </Popover.Button>
            </NetworkSelector>
          </div>
        </div>
      </div>
    </div>
  )
}
