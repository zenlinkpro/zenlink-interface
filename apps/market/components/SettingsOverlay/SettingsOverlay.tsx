import { CogIcon } from '@heroicons/react/24/outline'
import type { ParachainId } from '@zenlink-interface/chain'
import { IconButton, Overlay, SlideIn } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

interface SettingsOverlayProps {
  chainId: ParachainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlayProps> = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="grid grid-flow-col gap-4">
        <IconButton className="flex items-center hover:animate-spin-slow min-w-5 min-h-5" onClick={() => setOpen(true)}>
          <CogIcon height={20} width={20} />
        </IconButton>
      </div>
      <SlideIn>
        <SlideIn.FromLeft onClose={() => setOpen(false)} show={open}>
          <Overlay.Content className="!pb-0">
            <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
              <Overlay.Header onClose={() => setOpen(false)} title={<Trans>Settings</Trans>} />
              <div className="px-1 py-1">
                <SlippageToleranceDisclosure />
              </div>
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
