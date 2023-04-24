import type { FC } from 'react'
import React, { useCallback } from 'react'
import { Popover } from '@headlessui/react'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Typography, classNames } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { NetworkSelector } from '../NetworkSelector'
import type { NetworkSelectorOnSelectCallback } from '../NetworkSelector'
import { CHAIN_META, CROSS_TRANSFER_CHAINS } from '../config/chain'
import { NetworkIcon } from '../icons/NetworkIcon'

interface ChainSelectorsProps {
  open: boolean
  network0: string
  network1: string
  setNetwork0: (el: string) => void
  setNetwork1: (el: string) => void
  switchChains: () => void
}

export const ChainSelectors: FC<ChainSelectorsProps> = ({
  network0,
  network1,
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
            onClick={switchChains}
            type="button"
            className="z-10 group hover:bg-white/30 hover:dark:bg-white/[0.16] p-2 border-white transition-all rounded-full cursor-pointer"
          >
            <div className="transition-transform rotate-0 group-hover:rotate-180">
              <ArrowRightIcon strokeWidth={3} className="w-4 h-4 text-blue" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-[60px] border-gray-200 dark:border-slate-800">
          <div className="z-10">
            <NetworkSelector<string>
              networks={CROSS_TRANSFER_CHAINS}
              variant="dialog"
              selected={network0}
              onSelect={handleSelect0}
            >
              <Popover.Button
                as="button"
                className="transition-[background] gap-2 bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.08] hover:dark:bg-white/[0.08] pl-2 pr-3 font-medium flex flex-col rounded-xl py-1.5 w-full"
              >
                <Typography variant="xxs" className="px-1 pt-0.5">
                  <Trans>From</Trans>
                </Typography>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <NetworkIcon type="naked" chain={CHAIN_META[network0].chain} width={28} height={28} />
                    <Typography weight={500} className="truncate">
                      {CHAIN_META[network0].name}
                    </Typography>
                  </div>
                  <div className="min-w-4 min-h-4">
                    <ChevronDownIcon width={16} height={16} strokeWidth={3} />
                  </div>
                </div>
              </Popover.Button>
            </NetworkSelector>
          </div>
          <div className="z-10">
            <NetworkSelector
              networks={CROSS_TRANSFER_CHAINS}
              variant="dialog"
              selected={network1}
              onSelect={handleSelect1}
            >
              <Popover.Button
                as="button"
                className="transition-[background] gap-2 bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.08] hover:dark:bg-white/[0.08] pl-2 pr-3 font-medium flex flex-col rounded-xl py-1.5 w-full"
              >
                <Typography variant="xxs" className="px-1 pt-0.5">
                  <Trans>To</Trans>
                </Typography>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center justify-start gap-1.5 overflow-hidden">
                    <NetworkIcon type="naked" chain={CHAIN_META[network1].chain} width={28} height={28} />
                    <Typography weight={500} className="truncate">
                      {CHAIN_META[network1].name}
                    </Typography>
                  </div>
                  <div className="min-w-4 min-h-4">
                    <ChevronDownIcon width={16} height={16} strokeWidth={3} />
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
