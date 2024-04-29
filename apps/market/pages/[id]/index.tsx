import { ParachainId } from '@zenlink-interface/chain'
import { useMarket } from '@zenlink-interface/wagmi'
import { useRouter } from 'next/router'
import type { Address } from 'viem'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { Layout, MarketActions, MarketHeader } from 'components'

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

  const { data: market } = useMarket(
    ParachainId.MOONBEAM,
    router.query.id as Address,
    { enabled: !!router.query.id },
  )

  if (!market)
    return <></>

  return (
    <>
      <Layout breadcrumbs={LINKS(market)}>
        <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
          <div className="flex flex-col order-1 gap-9">
            <MarketHeader market={market} />
            <hr className="my-3 border-t border-slate-500/20 dark:border-slate-200/5" />
          </div>

          <div className="flex flex-col order-2 gap-4">
            <MarketActions market={market} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default MarketPage
