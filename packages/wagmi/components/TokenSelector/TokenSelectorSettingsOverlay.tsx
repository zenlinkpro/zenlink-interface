import type { FC } from 'react'
import type { TokenSelectorProps } from './TokenSelector'
import { CogIcon } from '@heroicons/react/24/outline'
import { IconButton, Overlay, SlideIn } from '@zenlink-interface/ui'

import { useState } from 'react'
import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'

type TokenSelectorSettingsOverlayProps = Pick<TokenSelectorProps, 'customTokenMap' | 'onRemoveToken'>

export const TokenSelectorSettingsOverlay: FC<TokenSelectorSettingsOverlayProps> = ({
  customTokenMap,
  onRemoveToken,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        className="hover:animate-spin-slow w-[24px] h-[24px] flex items-center justify-center"
        onClick={() => {
          setOpen(true)
        }}
      >
        <CogIcon className="hover:text-slate-50 text-slate-100" height={20} width={20} />
      </IconButton>
      <SlideIn.FromLeft onClose={() => setOpen(false)} show={open}>
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
          <div className="py-1 px-1">
            <TokenSelectorCustomTokensOverlay customTokenMap={customTokenMap} onRemoveToken={onRemoveToken} />
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
