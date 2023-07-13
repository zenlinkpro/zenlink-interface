import { CogIcon } from '@heroicons/react/24/outline'
import type { ParachainId } from '@zenlink-interface/chain'
import { isEvmNetwork } from '@zenlink-interface/compat'
import { IconButton, Overlay, SlideIn } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useState } from 'react'
import { t } from '@lingui/macro'

// import { AggregatorOverlay } from './AggregatorOverlay'

import { CustomTokensOverlay } from './CustomTokensOverlay'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

interface SettingsOverlayProps {
  chainId: ParachainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlayProps> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="grid grid-flow-col gap-4">
        <IconButton className="flex items-center hover:animate-spin-slow min-w-5 min-h-5" onClick={() => setOpen(true)}>
          <CogIcon width={20} height={20} />
        </IconButton>
      </div>
      <SlideIn>
        <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
          <Overlay.Content className="!pb-0">
            <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
              <Overlay.Header onClose={() => setOpen(false)} title={t`Settings`} />
              <div className="px-1 py-1">
                <SlippageToleranceDisclosure />
                {chainId && isEvmNetwork(chainId) && <CustomTokensOverlay />}
                {/* <AggregatorOverlay /> */}
              </div>
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
