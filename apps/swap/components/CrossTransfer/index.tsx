import { Typography, Widget } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import type { Type } from '@zenlink-interface/currency'
import { Trans } from '@lingui/macro'
import { CurrencyInput } from './CurrencyInput'
import { CROSS_TRANSFER_TOKEN_MAP, TokenSymbol } from './config/token'
import { ChainSelectors } from './ChainSelector'
import { Chains } from './config/chain'
import { CROSS_TRANSFER_CONFIG } from './config'
import { APP_LINKS } from './config/app'
import { CrossTransferApp } from './CrossTransferApp'

export const CrossTransfer: FC = () => {
  const [network0, setNetwork0] = useState<string>(Chains.Moonriver)
  const [network1, setNetwork1] = useState<string>(Chains.Moonbeam)

  const [tokenSymbol, setTokenSymbol] = useState(TokenSymbol.ZLK)
  const [token, setToken] = useState<Type>(CROSS_TRANSFER_TOKEN_MAP[tokenSymbol])
  const _setToken = useCallback((currency: Type) => {
    if (!currency.symbol)
      return
    setToken(currency)
    setTokenSymbol(currency.symbol as TokenSymbol)
  }, [])

  const _setNetwork0 = useCallback((network: string) => {
    if (network && network1 === network)
      setNetwork1(network0)
    setNetwork0(network)
  }, [network0, network1])

  const _setNetwork1 = useCallback((network: string) => {
    if (network && network0 === network)
      setNetwork0(network1)
    setNetwork1(network)
  }, [network0, network1])

  const switchChains = useCallback(() => {
    setNetwork0(network1)
    setNetwork1(network0)
  }, [network0, network1])

  const supportApps = useMemo(() => {
    const apps = CROSS_TRANSFER_CONFIG?.[tokenSymbol]?.[network0]?.[network1] ?? []
    const appLinks = apps.map(app => APP_LINKS[app]).filter(item => item)
    return appLinks
  }, [network0, network1, tokenSymbol])
  return (
    <div>
      <Widget id="cross-transfer" maxWidth={440}>
        <Widget.Content>
        <div className="p-3 flex items-center mt-1">
          <CurrencyInput
            tokenMap={CROSS_TRANSFER_TOKEN_MAP}
            currency={token}
            value={tokenSymbol}
            onSelect={_setToken}
            onChange={function (value: string): void {
              setTokenSymbol(value as TokenSymbol)
            } } />
            <span className="font-medium text-sm text-gray-700 dark:text-slate-400 ml-3">
              <Trans>
                Tools support cross transfer token from one chain to another.
              </Trans>
            </span>
        </div>
        <div className="px-3">
          <ChainSelectors
            open={true}
            network0={network0}
            network1={network1}
            setNetwork0={_setNetwork0}
            setNetwork1={_setNetwork1}
            switchChains={switchChains}
           />
        </div>
        <div className="p-3">
          <div className="flex flex-col">
            {supportApps.length > 0
              ? (<div>
                {supportApps.map(app => (<CrossTransferApp
                  key={app.url}
                  name={app.name}
                  link={app.url}
                  icon={app.icon}
                  description={app.description}
                  />))}
            </div>)
              : (<Typography>
                  <div className="font-medium text-sm h-24 text-gray-700 dark:text-slate-400 p-3 flex items-center justify-center">
                    <Trans>
                      We are collecting.
                    </Trans>
                  </div>
              </Typography>)}
          </div>
        </div>
        </Widget.Content>

      </Widget>
    </div>
  )
}
