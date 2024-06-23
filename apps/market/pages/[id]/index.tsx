import { ParachainId } from '@zenlink-interface/chain'
import { useMarket } from '@zenlink-interface/wagmi'
import { useRouter } from 'next/router'
import type { Address } from 'viem'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import { AppearOnMount, type BreadcrumbLink, LoadingOverlay } from '@zenlink-interface/ui'
import {
  Layout,
  MarketAPY,
  MarketActions,
  MarketChart,
  MarketComposition,
  MarketHeader,
  MarketRewards,
  MarketStats,
} from 'components'
import useSWR from 'swr'
import type { MarketGraphData } from '@zenlink-interface/graph-client'

function LINKS(market: Market): BreadcrumbLink[] {
  return [
    {
      href: `/${market.id}`,
      label: `${market.SY.yieldToken.symbol} - ${getMaturityFormatDate(market)}`,
    },
  ]
}

function MarketPage() {
  const router = useRouter()

  const { data: market, isLoading } = useMarket(
    ParachainId.MOONBEAM,
    router.query.id as Address,
    { enabled: !!router.query.id },
  )

  const { data: marketGraphData, isLoading: isMarketGraphDataLoading } = useSWR<MarketGraphData | undefined>(
    `/market/api/market/${router.query.id}`,
    (url: string) => fetch(url).then(response => response.json()),
  )

  if (!market)
    return <LoadingOverlay show={isLoading} />

  return (
    <>
      <Layout breadcrumbs={LINKS(market)} maxWidth="6xl">
        <div className="flex flex-col lg:grid lg:grid-cols-[690px_auto] gap-16">
          <div className="flex flex-col order-1 gap-9">
            <MarketHeader market={market} />
            <hr className="my-3 border-t border-slate-500/20 dark:border-slate-200/5" />
            <MarketChart isLoading={isMarketGraphDataLoading} market={marketGraphData} />
            <AppearOnMount show={!!marketGraphData}>
              <MarketStats market={marketGraphData} />
            </AppearOnMount>
            <MarketComposition market={market} />
            <MarketAPY graphData={marketGraphData} market={market} />
          </div>
          <div className="flex flex-col order-2 gap-4">
            <MarketActions market={market} />
            <MarketRewards market={market} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default MarketPage
