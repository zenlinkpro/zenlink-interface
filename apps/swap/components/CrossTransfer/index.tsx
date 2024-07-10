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
    setNetwork0('')
    setNetwork1('')
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
    const appLinks = apps.map(app => APP_LINKS[app]).filter(Boolean)
    return appLinks
  }, [network0, network1, tokenSymbol])

  const networkList0 = useMemo(() => {
    return Object.keys(CROSS_TRANSFER_CONFIG?.[tokenSymbol] ?? {})
  }, [tokenSymbol])

  const networkList1 = useMemo(() => {
    return Object.keys(CROSS_TRANSFER_CONFIG?.[tokenSymbol]?.[network0] ?? {})
  }, [network0, tokenSymbol])

  return (
    <Widget id="cross-transfer" maxWidth={440}>
      <Widget.Content>
        <div className="p-3 flex items-center mt-1">
          <CurrencyInput
            currency={token}
            onChange={value => setTokenSymbol(value as TokenSymbol)}
            onSelect={_setToken}
            tokenMap={CROSS_TRANSFER_TOKEN_MAP}
            value={tokenSymbol}
          />
          <Typography className="font-medium text-sm text-gray-700 dark:text-slate-400 ml-3">
            <Trans>Tools support cross transfer token from one chain to another.</Trans>
          </Typography>
        </div>
        <div className="px-3">
          <ChainSelectors
            network0={network0}
            network1={network1}
            networkList0={networkList0}
            networkList1={networkList1}
            open
            setNetwork0={_setNetwork0}
            setNetwork1={_setNetwork1}
            switchChains={switchChains}
          />
        </div>
        <div className="p-3 flex flex-col">
          {supportApps.length > 0
            ? (
                <div>
                  {supportApps.map(app => (
                    <CrossTransferApp
                      description={app.description}
                      icon={app.icon}
                      key={app.url}
                      link={app.urlParse ? app.urlParse(tokenSymbol, network0, network1) : app.url}
                      name={app.name}
                    />
                  ))}
                </div>
              )
            : (
                <Typography className="font-medium text-sm h-24 text-gray-700 dark:text-slate-400 p-3 flex items-center justify-center">
                  {(network0 && network1) ? <Trans>Not supported yet</Trans> : <Trans>Please select network</Trans>}
                </Typography>
              )}
        </div>
      </Widget.Content>
    </Widget>
  )
}
