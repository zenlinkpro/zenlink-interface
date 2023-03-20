import { chainName } from '@zenlink-interface/chain'
import { formatFullNumber, formatPercent } from '@zenlink-interface/format'
import { useZLKStats } from '@zenlink-interface/shared'
import { Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { RateDesc } from './InitialIcon'

const COLORS = [
  '#FF1995FF',
  '#975CF5FF',
  '#01A3EEFF',
  '#6BDF9EFF',
  '#F3E500FF',
  '#FF733EFF',
]

export const CirculatingDistribution: FC = () => {
  const { data: stats, isLoading, isError } = useZLKStats()

  const totalStats = useMemo(
    () => (stats || []).reduce((total, { totalTvlUSD, totalVolumeUSD, holders, totalDistribute, totalBurn }) => {
      total.totalTvl = total.totalTvl + Number(totalTvlUSD)
      total.totalVolume = total.totalVolume + Number(totalVolumeUSD)
      total.totalHolders = total.totalHolders + holders
      total.totalCirculatingSupply = total.totalCirculatingSupply + Number(totalDistribute)
      total.totalBurn = total.totalBurn + Number(totalBurn)
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

  const data = useMemo(() => (stats ?? []).map(s => ({
    amount: Number((s.totalDistribute)) / (10 ** 18),
    chainName: chainName[Number(s.chainId)],
    percent: formatPercent(Number(s.totalDistribute) / totalStats.totalCirculatingSupply),
  })), [stats, totalStats.totalCirculatingSupply])

  return (
    <>
      {(isLoading || isError)
        ? <div className=" h-full bg-slate-700 animate-pulse w-full rounded-md" />
        : (
          <section>
            <Typography weight={600}>Circulating Distribution</Typography>
            <div className="h-80 relative">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart height={300} width={300}>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={data}
                    className="text-sm font-semibold"
                    dataKey="amount"
                    fill="#8884d8"
                    innerRadius={80}
                    labelLine={false}
                    label={p => p.chainName}
                    isAnimationActive={false}
                    outerRadius={120}
                    paddingAngle={2}
                    startAngle={0}
                    stroke={'#000'}
                  >
                    {data.map((d, index) => (
                      <Cell fill={COLORS[index % COLORS.length]} key={d.chainName} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute w-full h-full flex items-center justify-center right-0 top-0">
                <div className="flex flex-col justify-center items-center gap-1">
                  <Typography variant="sm">Circulating Supply</Typography>
                  <Typography weight={500} className="bg-clip-text text-transparent bg-rainbow-gradient">
                    {formatFullNumber(totalStats.totalCirculatingSupply / (10 ** 18)) ?? '~'}
                  </Typography>
                </div>
              </div>
            </div>
            <div>
              <div className="h-40 flex items-center justify-center">
                <div className="flex flex-col text-white text-sm gap-0.5">
                  {data.map((d, index) => (
                    <RateDesc
                      color={COLORS[index % COLORS.length]}
                      key={d.chainName}
                      title={d.chainName}
                      desc={`${formatFullNumber(d.amount)} (${d.percent})`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          )}
    </>
  )
}
