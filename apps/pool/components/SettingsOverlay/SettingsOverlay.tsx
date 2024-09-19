import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { CogIcon } from '@heroicons/react/24/outline'
import { isEvmNetwork } from '@zenlink-interface/compat'
import { Dialog, IconButton, Overlay, SlideIn } from '@zenlink-interface/ui'
import { useState } from 'react'

import { CustomTokensOverlay } from './CustomTokensOverlay'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

interface SettingsOverlayProps {
  chainId: ParachainId | undefined
  variant?: 'dialog' | 'overlay'
}

export const SettingsOverlay: FC<SettingsOverlayProps> = ({ variant = 'overlay', chainId }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon height={20} width={20} />
      </IconButton>
      {variant === 'dialog'
        ? (
            <Dialog onClose={() => setOpen(false)} open={open}>
              <Dialog.Content className="!pb-0 min-h-[320px] max-w-sm">
                <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
                  <Dialog.Header onClose={() => setOpen(false)} title="Settings" />
                  <div className="px-1 py-1">
                    <SlippageToleranceDisclosure />
                    {chainId && isEvmNetwork(chainId) && <CustomTokensOverlay />}
                  </div>
                </div>
              </Dialog.Content>
            </Dialog>
          )
        : (
            <SlideIn>
              <SlideIn.FromLeft onClose={() => setOpen(false)} show={open}>
                <Overlay.Content className="!pb-0">
                  <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
                    <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
                    <div className="px-1 py-1">
                      <SlippageToleranceDisclosure />
                      {chainId && isEvmNetwork(chainId) && <CustomTokensOverlay />}
                    </div>
                  </div>
                </Overlay.Content>
              </SlideIn.FromLeft>
            </SlideIn>
          )}
    </>
  )
}
