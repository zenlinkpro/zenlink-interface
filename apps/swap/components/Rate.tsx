import type { Price, Type } from '@zenlink-interface/currency'
import { Typography, classNames } from '@zenlink-interface/ui'
import type { FC, ReactElement, ReactNode } from 'react'
import { useCallback, useState } from 'react'

interface RenderPayload {
  invert: boolean
  toggleInvert(): void
  content: ReactElement
}

interface RateProps {
  price: Price<Type, Type> | undefined
  children?: (payload: RenderPayload) => ReactNode
}

export const Rate: FC<RateProps> = ({ children, price }) => {
  const [invert, setInvert] = useState(false)

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
    return <>{children({ invert, toggleInvert, content })}</>

  return (
    <div
      className={classNames(
        'text-slate-300 hover:text-slate-200 flex justify-between border-t border-opacity-40 border-slate-700',
      )}
    >
      <Typography variant="xs" className={classNames('cursor-pointer h-[36px] flex items-center gap-1')}>
        Rate
      </Typography>
      <Typography variant="xs" className={classNames('cursor-pointer h-[36px] flex items-center ')}>
        {price
          ? (
            <div className="flex items-center h-full gap-1 font-medium" onClick={toggleInvert}>
              {content}
            </div>
            )
          : (
              'Enter an amount'
            )}
      </Typography>
    </div>
  )
}
