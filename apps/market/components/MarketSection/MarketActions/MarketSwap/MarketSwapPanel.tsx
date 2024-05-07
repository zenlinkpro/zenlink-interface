import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Web3Input } from '@zenlink-interface/compat'
import type { Token, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { type FC, useCallback, useMemo, useState } from 'react'

interface MarketSwapPanelProps {
  market: Market
  isPt: boolean
}

interface TokenMap {
  [address: string]: Token
}

export const MarketSwapPanel: FC<MarketSwapPanelProps> = ({ market, isPt }) => {
  const defaultTokenMap: TokenMap = useMemo(() => {
    const initialTokenMap = {
      [market.SY.yieldToken.address]: market.SY.yieldToken,
    }
    return isPt
      ? { ...initialTokenMap, [market.YT.address]: market.YT }
      : { ...initialTokenMap, [market.PT.address]: market.PT }
  }, [isPt, market.PT, market.SY.yieldToken, market.YT])

  const [input, setInput] = useState<string>('')
  const [[inputToken, outputToken], setTokens] = useState<[Type | undefined, Type | undefined]>(
    [market.SY.yieldToken, isPt ? market.PT : market.YT],
  )
  const [output, setOutput] = useState<string>('')
  const [[inputTokenMap, outputTokenMap], setTokenMaps] = useState<[TokenMap, TokenMap]>([defaultTokenMap, {}])

  const onInput = useCallback((val: string) => {
    setInput(val)
  }, [])

  const onOutput = useCallback((val: string) => {
    setOutput(val)
  }, [])

  const switchCurrencies = useCallback(() => {
    setTokens(([prevSrc, prevDst]) => [prevDst, prevSrc])
    setTokenMaps(([prevSrc, prevDst]) => [prevDst, prevSrc])
  }, [])

  const _setInputToken = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevDst && currency.equals(prevDst) ? [prevDst, prevSrc] : [currency, prevDst]
    })
  }, [])

  const _setOutputToken = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevSrc && currency.equals(prevSrc) ? [prevDst, prevSrc] : [prevSrc, currency]
    })
  }, [])

  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={inputToken}
        loading={!inputToken}
        onChange={onInput}
        onSelect={_setInputToken}
        tokenMap={inputTokenMap}
        value={input}
      />
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div
          className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full cursor-pointer"
          onClick={switchCurrencies}
        >
          <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
            <ChevronDownIcon height={16} width={16} />
          </div>
        </div>
      </div>
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={outputToken}
        loading={!outputToken}
        onChange={onOutput}
        onSelect={_setOutputToken}
        tokenMap={outputTokenMap}
        value={output}
      />
    </div>
  )
}
