import { chainName } from '@zenlink-interface/chain'
import { useZLKStats } from '@zenlink-interface/shared'
import numeral from 'numeral'
import type { FC } from 'react'
import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { RateDesc } from './InitialSvg'

const CIRCULAT_COLOR = [
  '#FF1995FF',
  '#975CF5FF',
  '#01A3EEFF',
  '#6BDF9EFF',
  '#F3E500FF',
  '#FF733EFF',
]

export const CirculatingDistribution: FC = () => {
  const status = useZLKStats()
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
  const data = useMemo(() => {
    const dataArray = status.data ?? []
    return dataArray.map((item: any) => {
      return ({
        amount: (item.zenlinkInfo.totalDistribute) / (10 ** 18),
        chainName: chainName[Number(item.chainId)],
        percent: ((item.zenlinkInfo.totalDistribute / totalData.totalCirculatingSupply)),
      })
    })
  }, [status.data, totalData.totalCirculatingSupply])

  if (status.isLoading || status.isError)
    return <div className=" h-full bg-slate-700 animate-pulse w-full rounded-md"></div>
  return (
    <section className="">
      <div className="h-80 relative">
        <ResponsiveContainer height={'100%'} width={'100%'}>
          <PieChart height={300} width={300}>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="amount"
              fill="#8884d8"
              innerRadius={80}
              isAnimationActive={false}
              outerRadius={120}
              paddingAngle={2}
              startAngle={0}
              stroke={'#00000000'}
            >
              {data.map((_entry: any, index: number) => (
                <Cell fill={CIRCULAT_COLOR[index % CIRCULAT_COLOR.length]} key={`cell-${index}`} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute w-full h-full flex items-center justify-center right-0 top-0">
          <div className="flex flex-col justify-center items-center">
            <div className=" text-xs text-zenlink-gray06 mb-1 ">{'Circulating Supply'}</div>
            <div style={{
              background: 'linear-gradient(90deg, #8100E1 0%, #008EF3 41%, #00CCD5 63%, #F2B082 75%, #F20082 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{numeral(totalData.totalCirculatingSupply / (10 ** 18)).format('0,0') ?? '~'}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="h-40 flex items-center justify-center">
          <div className="text-white text-xs grid grid-cols-2 justify-self-center self-center">
            {data.map((item: any, index: number) => {
              return <RateDesc className="mb-5" color={CIRCULAT_COLOR[index % CIRCULAT_COLOR.length]} desc={''} key={index} title={`${item.chainName}: ${numeral(item.amount).format('0,0')} (${(item.percent * 100).toFixed(2)}%)`}/>
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
