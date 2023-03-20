import type { FC } from 'react'
import { useMemo } from 'react'
import numeral from 'numeral'
import { useZLKPrice, useZLKStats } from '@zenlink-interface/shared'
import { formatFullNumber, formatUSD } from '@zenlink-interface/format'
import { Link } from '@zenlink-interface/ui'
import { StatsCard } from './StatsCard'
import { DistributionSection } from './DistributionSection'

export const ZLKStats: FC = () => {
  const { data: stats, isLoading } = useZLKStats()
  const { data: zlkPrice, isLoading: isZLKPriceLoading } = useZLKPrice()

  const totalStats = useMemo(
    () => (stats ?? []).reduce((total, { totalTvlUSD, totalVolumeUSD, holders, totalDistribute, totalBurn }) => {
      total.totalTvl = total.totalTvl + Number(totalTvlUSD)
      total.totalVolume = total.totalVolume + Number(totalVolumeUSD)
      total.totalHolders = total.totalHolders + holders
      total.totalBurn = total.totalBurn + Number(totalBurn) / (10 ** 18)
      total.totalCirculatingSupply = total.totalCirculatingSupply + Number(totalDistribute) / (10 ** 18)
      return total
    }, {
      totalTvl: 0,
      totalVolume: 0,
      totalHolders: 0,
      totalCirculatingSupply: 0,
      totalBurn: 0,
      totalMarketCap: 0,
    }),
    [stats],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full space-y-5">
        <div className="grid gap-4 overflow-auto grid-col-1 lg:grid-cols-3">
          <StatsCard
            loading={isZLKPriceLoading}
            text="ZLK Price"
            number={numeral(zlkPrice).format('$0,0.000')}
          />
          <StatsCard
            loading={isLoading}
            text="Total Supply"
            number={formatFullNumber(100000000)}
          />
          <StatsCard
            loading={isLoading}
            text="Holders"
            number={formatFullNumber(totalStats?.totalHolders ?? 0)}
          />
        </div>
        <div className="grid gap-4 overflow-auto grid-col-1 lg:grid-cols-3">
          <StatsCard
            loading={isLoading || isZLKPriceLoading}
            text="ZLK Market Cap"
            number={formatUSD(zlkPrice ? (totalStats?.totalCirculatingSupply) * zlkPrice : 0, '$0,0')}
          />
          <StatsCard
            loading={isLoading}
            text="ZLK Circulating Supply"
            number={formatFullNumber(totalStats?.totalCirculatingSupply)}
          />
          <Link.External href="https://wiki.zenlink.pro/ecosystem/buyback">
            <StatsCard
              loading={isLoading}
              text="Burn Total"
              number={formatFullNumber(totalStats?.totalBurn)}
            />
          </Link.External>
        </div>
      </div>
      <DistributionSection />
    </div>
  )
}
