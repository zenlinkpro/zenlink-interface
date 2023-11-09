import { Trans } from '@lingui/macro'
import { ChartSection, Layout, PoolsFiltersProvider, TableSection } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { getCharts, getPoolCount, getPools } from 'lib/api'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import type { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

export const getStaticProps: GetStaticProps = async () => {
  const [pools, charts, poolCount] = await Promise.all([
    getPools(),
    getCharts(),
    getPoolCount(),
  ])

  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/analytics/api/pools',
          args: {
            selectedNetworks: SUPPORTED_CHAIN_IDS,
            selectedPoolTypes: Object.keys(AVAILABLE_POOL_TYPE_MAP),
            query: '',
            extraQuery: '',
          },
        })]: pools,
        [unstable_serialize({
          url: '/analytics/api/charts',
          args: {
            selectedNetworks: SUPPORTED_CHAIN_IDS,
          },
        })]: charts,
        '/analytics/api/pools/count': poolCount,
      },
    },
    revalidate: 900,
  }
}

const Index: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Index />
    </SWRConfig>
  )
}

function _Index() {
  return (
    <Layout>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Zenlink{' '}
              <Trans>Analytics</Trans>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              <Trans>Analytics platform for tracking the liquidity, volume, and fees generated by Zenlink products.</Trans>
            </p>
          </div>
        </section>
        <PoolsFiltersProvider>
          <ChartSection />
          <TableSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Index
