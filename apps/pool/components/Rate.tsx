import type { Price, Type } from '@zenlink-interface/currency'
import type { FC, ReactElement, ReactNode } from 'react'
import { Trans } from '@lingui/macro'
import { usePrices } from '@zenlink-interface/shared'
import { classNames, Typography } from '@zenlink-interface/ui'
import { useCallback, useState } from 'react'

interface RenderPayload {
  invert: boolean
  toggleInvert: () => void
  content: ReactElement
  usdPrice?: string
}

interface RateProps {
  price: Price<Type, Type> | undefined
  children?: (payload: RenderPayload) => ReactNode
}

export const Rate: FC<RateProps> = ({ children, price }) => {
  const [invert, setInvert] = useState(false)
  const { data: prices } = usePrices({ chainId: invert ? price?.quoteCurrency.chainId : price?.baseCurrency.chainId })
  const usdPrice = price
    ? prices?.[invert ? price.quoteCurrency.wrapped.address : price.baseCurrency.wrapped.address]?.toFixed(2)
    : undefined

  const content = (
    <>
      {invert
        ? (
            <>
              1 {price?.invert().baseCurrency.symbol} = {price?.invert().toSignificant(6)}{' '}
              {price?.invert().quoteCurrency.symbol}
            </>
          )
        : (
            <>
              1 {price?.baseCurrency.symbol} = {price?.toSignificant(6)} {price?.quoteCurrency.symbol}
            </>
          )}
    </>
  )

  const toggleInvert = useCallback(() => {
    setInvert(prevState => !prevState)
  }, [])

  if (typeof children === 'function')
    return <>{children({ invert, toggleInvert, content, usdPrice })}</>

  return (
    <div
      className={classNames(
        'text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex justify-between border-t border-opacity-40 border-slate-300 dark:border-slate-700',
      )}
    >
      <Typography className={classNames('cursor-pointer h-[36px] flex items-center gap-1')} variant="xs">
        <Trans>Rate</Trans>
      </Typography>
      <Typography className={classNames('cursor-pointer h-[36px] flex items-center ')} variant="xs">
        {price
          ? (
              <div className="flex items-center h-full gap-1 font-medium" onClick={toggleInvert}>
                {content} <span className="text-slate-500">(${usdPrice})</span>
              </div>
            )
          : 'Enter an amount'}
      </Typography>
    </div>
  )
}
