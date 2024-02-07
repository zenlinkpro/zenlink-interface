import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import chain from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { shortenAddress } from '@zenlink-interface/format'
import { Button, CopyHelper, Currency, Overlay, SlideIn, Typography, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo, useState } from 'react'

interface TokenSelectorImportRowProps {
  hideIcons?: boolean
  currencies: (Token | undefined)[]
  className?: string
  onImport: () => void
  slideIn?: boolean
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRowProps> = ({
  currencies,
  className,
  onImport,
  hideIcons = false,
  slideIn = true,
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const content = useMemo(
    () => (
      <div className="space-y-3 my-3">
        <div className="rounded-2xl p-3 flex flex-col gap-2 items-center">
          {!hideIcons && (
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden">
              <div className="flex items-center justify-center w-full h-full bg-red/10">
                <div className="w-5 h-5">
                  <ExclamationTriangleIcon className="text-red" height={20} width={20} />
                </div>
              </div>
            </div>
          )}
          <Typography className="text-gray-900 dark:text-slate-200" variant="lg" weight={500}>
            Trade at your own risk!
          </Typography>
          <Typography className="text-gray-600 dark:text-slate-400 text-center" variant="sm" weight={400}>
            {currencies.length > 1 ? 'These tokens don\'t' : 'This token doesn\'t'} appear on the active token list(s).
            Anyone can create a token, including creating fake versions of existing tokens that claim to represent
            projects
          </Typography>
        </div>
        {currencies.map((currency) => {
          if (!currency)
            return null
          return (
            <div
              className="flex justify-between px-4 p-3 items-center bg-slate-200 dark:bg-slate-700 rounded-2xl"
              key={currency.wrapped.address}
            >
              <div className="flex flex-col">
                <Typography className="text-slate-800 dark:text-slate-200" weight={500}>
                  {currency.symbol}
                </Typography>
                <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
                  {currency.name}
                </Typography>
              </div>
              <div className="flex-flex-col">
                <Typography
                  as="a"
                  className="text-blue hover:text-blue-400 flex gap-1 items-center"
                  href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="sm"
                  weight={500}
                >
                  View on Explorer <ArrowTopRightOnSquareIcon height={16} width={16} />
                </Typography>
                <Typography className="text-slate-600 dark:text-slate-400 flex justify-end" variant="xs" weight={500}>
                  <CopyHelper toCopy={shortenAddress(currency.wrapped.address)}>
                    {shortenAddress(currency.wrapped.address)}
                  </CopyHelper>
                </Typography>
              </div>
            </div>
          )
        })}
        <Button as="div" onClick={onImport} size="md">
          Import
        </Button>
      </div>
    ),
    [currencies, hideIcons, onImport],
  )

  return (
    <>
      {slideIn && currencies[0]
        ? (
          <>
            <button
              className={classNames(
                className,
                `group flex items-center w-full px-6 py-2.5 token-${currencies[0]?.symbol}`,
              )}
              onClick={() => setOpen(true)}
              type="button"
            >
              <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
                <div className="flex flex-row items-center flex-grow gap-2">
                  <div className="w-7 h-7">
                    <Currency.Icon currency={currencies[0]} height={28} width={28} />
                  </div>
                  <div className="flex flex-col items-start">
                    <Typography className="text-slate-200" variant="xs" weight={500}>
                      {currencies[0].symbol}
                    </Typography>
                    <Typography className="text-slate-500" variant="xxs">
                      {currencies[0].name}
                    </Typography>
                  </div>
                </div>
                <Button as="div" color="blue" size="xs">
                  Import
                </Button>
              </div>
            </button>
            <SlideIn.FromLeft onClose={() => setOpen(false)} show={open}>
              <Overlay.Content className="bg-white dark:bg-slate-800 !pb-0">
                <Overlay.Header onClose={() => setOpen(false)} title="Import Token" />
                {content}
              </Overlay.Content>
            </SlideIn.FromLeft>
          </>
          )
        : (
            content
          )}
    </>
  )
}
