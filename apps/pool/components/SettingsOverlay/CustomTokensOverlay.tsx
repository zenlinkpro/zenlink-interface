import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import type { Token } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import { useAllCustomTokens } from '@zenlink-interface/shared'
import { Currency, Overlay, SlideIn, Tooltip, Typography } from '@zenlink-interface/ui'
import { TokenSelectorCustomTokenRow } from '@zenlink-interface/wagmi'
import type { FC } from 'react'
import React, { useMemo, useState } from 'react'

export const CustomTokensOverlay: FC = () => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)
  const [customTokens, { removeCustomToken }] = useAllCustomTokens()
  const [ids, tokens] = useMemo(() => {
    const ids: string[] = []
    const tokens: Token[] = []
    Object.values(customTokens).forEach(customTokensPerChain =>
      Object.entries(customTokensPerChain).forEach(([k, v]) => {
        ids.push(k)
        tokens.push(v)
      }),
    )

    return [ids, tokens]
  }, [customTokens])

  if (!isMounted)
    return <></>

  return (
    <div className="border-b border-slate-500/20 dark:border-slate-200/5">
      <button
        onClick={() => setOpen(true)}
        className="group items-center relative rounded-xl flex justify-between gap-3 w-full"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <CurrencyDollarIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex gap-1 w-full justify-between items-center py-4">
          <div className="flex gap-1 items-center">
            <Typography variant="sm" weight={500}>
              Custom Tokens
            </Typography>
            <Tooltip
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <div className="w-80 flex flex-col gap-2">
                  <Typography variant="xs" weight={500}>
                    Import a token that is not currently on the list by pasting its address here to add it. Custom
                    tokens are stored locally in your browser.
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex gap-1">
            <Typography variant="sm" weight={500} className="group-hover:text-slate-800 dark:group-hover:text-slate-200 text-slate-600 dark:text-slate-400">
              {ids.length || '0'} Tokens
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-800 dark:group-hover:text-slate-200 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content className="!bg-slate-200 dark:!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Custom Tokens" />
          <div className="-ml-3 -mr-3 relative min-h-[320px] rounded-t-none lg:max-h-[calc(100%-108px)] rounded-xl overflow-hidden h-full">
            <Currency.List
              className="h-full"
              currencies={tokens}
              rowRenderer={({ style, currency }) => (
                <TokenSelectorCustomTokenRow
                  style={style}
                  currency={currency}
                  onRemove={() => removeCustomToken({ chainId: currency.chainId, address: currency.wrapped.address })}
                />
              )}
            />
          </div>
          {tokens.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
              <div className="flex flex-col gap-1 justify-center items-center">
                <Typography variant="xs" className="flex italic text-slate-500">
                  No custom tokens found
                </Typography>
              </div>
            </div>
          )}
        </Overlay.Content>
      </SlideIn.FromLeft>
    </div>
  )
}
