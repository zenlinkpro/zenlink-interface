import { formatUSD } from '@zenlink-interface/format'
import { usePrices } from '@zenlink-interface/shared'
import { AppearOnMount, Currency, Table, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'

interface MarketCompositionProps {
  market: Market
}

export const MarketComposition: FC<MarketCompositionProps> = ({ market }) => {
  const { data: prices } = usePrices({ chainId: market.chainId })
  const reserveUSD = formatUSD(
    prices?.[market.wrapped.address]
      ? market.marketState.totalLp.multiply(prices?.[market.wrapped.address].asFraction).toSignificant(6)
      : '',
  )

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <Typography className="text-slate-900 dark:text-slate-50" weight={600}>
          <Trans>Market Composition</Trans>
        </Typography>
        <AppearOnMount>
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>Total Assets:</Trans>{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {' '}
              {reserveUSD}
            </span>
          </Typography>
        </AppearOnMount>
      </div>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left"><Trans>Token</Trans></div>
              </Table.th>
              <Table.th>
                <div className="text-left"><Trans>Amount</Trans></div>
              </Table.th>
              <Table.th>
                <div className="text-left"><Trans>Value</Trans></div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            <Table.tr>
              <Table.td>
                <div className="flex items-center gap-3">
                  <Currency.Icon currency={market.SY} height={24} width={24} />
                  <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                    {market.SY.symbol}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
                  {market.marketState.totalSy.toSignificant(6)}
                </Typography>
              </Table.td>
              <Table.td>
                <AppearOnMount>
                  <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                    {formatUSD(
                      prices?.[market.SY.wrapped.address]
                        ? market.marketState.totalSy.multiply(prices?.[market.SY.wrapped.address].asFraction).toSignificant(6)
                        : '',
                    )}
                  </Typography>
                </AppearOnMount>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <div className="flex items-center gap-3">
                  <Currency.Icon currency={market.PT} height={24} width={24} />
                  <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                    {market.PT.symbol}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
                  {market.marketState.totalPt.toSignificant(6)}
                </Typography>
              </Table.td>
              <Table.td>
                <AppearOnMount>
                  <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                    {formatUSD(
                      prices?.[market.PT.wrapped.address]
                        ? market.marketState.totalPt.multiply(prices?.[market.PT.wrapped.address].asFraction).toSignificant(6)
                        : '',
                    )}
                  </Typography>
                </AppearOnMount>
              </Table.td>
            </Table.tr>
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
