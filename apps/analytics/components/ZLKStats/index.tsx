import type { FC } from 'react'
import { useMemo } from 'react'
import numeral from 'numeral'
import { useZLKPrice, useZLKStats } from '@zenlink-interface/shared'
import InfoCard from './InfoCard'
import { DistributionSection } from './DistributionSection'

export const ZLKStats: FC = () => {
  const status = useZLKStats()

  const zlkPrice = useZLKPrice()

  const totalData = useMemo(() => {
    const dataArray = status.data ?? []
    const totalData = dataArray.reduce((total: any, cur: any) => {
      const zenlinkStatus = cur.zenlinkInfo
      return {
        totalTvl: total.totalTvl + Number(zenlinkStatus.totalTvlUSD),
        totalVolume: total.totalVolume + Number(zenlinkStatus.totalVolumeUSD),
        totalHolders: total.totalHolders + Number(zenlinkStatus.holders),
        totalCirculatingSupply: total.totalCirculatingSupply + Number(zenlinkStatus.totalDistribute),
        totalBurn: total.totalBurn + Number(zenlinkStatus.totalBurn),
        totalMarketCap: total.totalMarketCap + Number(0),
      }
    }, {
      totalTvl: 0,
      totalVolume: 0,
      totalHolders: 0,
      totalCirculatingSupply: 0,
      totalBurn: 0,
      totalMarketCap: 0,
    })
    return totalData
  }, [status])

  return <div className="flex flex-col gap-6">
    <div className="w-full space-y-5">
      <div className="grid grid-flow-col gap-4 overflow-auto grid-col-1 lg:grid-cols-3">
        <InfoCard loading={status.isLoading || status.isError} text="ZLK Price" number={numeral(zlkPrice.data).format('$0,0.000000')}/>
        <InfoCard loading={status.isLoading || status.isError} text="Total Supply" number={numeral('100000000').format('$0,0')}/>
        <InfoCard loading={status.isLoading || status.isError} text="Holders" number={numeral(totalData?.totalHolders ?? 0).format('0,0')}/>
      </div>
      <div className="grid grid-flow-col gap-4 overflow-auto grid-col-1 lg:grid-cols-3">
        <InfoCard loading={status.isLoading || status.isError} text="ZLK Market Cap" number={numeral(zlkPrice.data ? (totalData?.totalCirculatingSupply / (10 ** 18)) * zlkPrice.data : 0).format('$0,0')}/>
        <InfoCard loading={status.isLoading || status.isError} text="ZLK Circulating Supply" number={numeral(totalData?.totalCirculatingSupply / (10 ** 18)).format('0,0')}/>
        <InfoCard loading={status.isLoading || status.isError} text="ZLK Burn" number={numeral(totalData?.totalBurn / (10 ** 18)).format('0,0')}/>
      </div>
    </div>
    <div>
      <DistributionSection />
    </div>
  </div>
}
