import { ArrowTopRightOnSquareIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon, XCircleIcon } from '@heroicons/react/24/solid'
import chain from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Currency, IconButton, NetworkIcon, Overlay, SlideIn, Typography } from '@zenlink-interface/ui'
import type { CSSProperties, FC } from 'react'
import { useMemo, useState } from 'react'

import type { TokenSelectorProps } from './TokenSelector'

export const TokenSelectorCustomTokenRow: FC<{ style: CSSProperties, currency: Type, onRemove: () => void }> = ({
  style,
  currency,
  onRemove,
}) => {
  return (
    <div className="flex items-center w-full p-4" style={style}>
      <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
        <div className="flex flex-row items-center flex-grow gap-2">
          <div className="w-7 h-7">
            <Currency.Icon currency={currency} height={28} width={28} />
          </div>
          <div className="flex flex-col items-start">
            <Typography className="text-slate-800 dark:text-slate-200" variant="xs" weight={500}>
              {currency.symbol}
            </Typography>
            <div className="flex gap-1">
              <NetworkIcon chainId={currency.chainId} height={14} type="naked" width={14} />
              <Typography className="text-slate-500" variant="xxs">
                {chain[currency.chainId].name}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconButton onClick={onRemove}>
            <XCircleIcon className="text-slate-500" height={20} width={20} />
          </IconButton>
          <IconButton
            as="a"
            href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)}
            rel="noopener noreffer"
            target="_blank"
          >
            <ArrowTopRightOnSquareIcon className="text-blue" height={20} width={20} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

type TokenSelectorSettingsOverlayProps = Pick<TokenSelectorProps, 'customTokenMap' | 'onRemoveToken'>

export const TokenSelectorCustomTokensOverlay: FC<TokenSelectorSettingsOverlayProps> = ({
  customTokenMap,
  onRemoveToken,
}) => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)
  const [ids, tokens] = useMemo(() => {
    const ids: string[] = []
    const tokens: Token[] = []
    if (customTokenMap) {
      Object.entries(customTokenMap).forEach(([k, v]) => {
        ids.push(k)
        tokens.push(v)
      })
    }

    return [ids, tokens]
  }, [customTokenMap])

  if (!isMounted)
    return <></>

  return (
    <>
      <button
        className="relative flex items-center justify-between w-full gap-3 group rounded-xl"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-center w-5 h-5">
          <CurrencyDollarIcon className="-ml-0.5 text-slate-500" height={20} width={20} />
        </div>
        <div className="flex items-center justify-between w-full gap-1 py-4">
          <Typography variant="sm" weight={500}>
            Custom Tokens
          </Typography>
          <div className="flex gap-1">
            <Typography className="group-hover:text-slate-200 text-slate-300" variant="sm">
              {ids.length || '0'} Tokens
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon className="group-hover:text-slate-200 text-slate-300" height={16} width={16} />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft className="!mt-0" onClose={() => setOpen(false)} show={open}>
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Custom Tokens" />
          <div className="border-t border-slate-200/5 -ml-3 -mr-3 relative min-h-[320px] rounded-t-none lg:max-h-[calc(100%-108px)] rounded-xl overflow-hidden h-full">
            <Currency.List
              className="h-full"
              currencies={tokens}
              rowRenderer={({ style, currency }) => (
                <TokenSelectorCustomTokenRow
                  currency={currency}
                  onRemove={() =>
                    onRemoveToken && onRemoveToken({ chainId: currency.chainId, address: currency.wrapped.address })}
                  style={style}
                />
              )}
            />
          </div>
          {tokens.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-center gap-1">
                <Typography className="flex italic text-slate-500" variant="xs">
                  No custom tokens found
                </Typography>
              </div>
            </div>
          )}
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
