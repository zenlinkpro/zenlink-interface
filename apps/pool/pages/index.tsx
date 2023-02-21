import { Button } from '@zenlink-interface/ui'
import { PlusIcon } from '@heroicons/react/24/solid'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import type { FC } from 'react'
import { useMemo } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'
import { getPools } from 'lib/api'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Layout, PoolsFiltersProvider, PoolsSection } from 'components'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'

export const getStaticProps: GetStaticProps = async () => {
  const [pools] = await Promise.all([getPools()])
  return {
    props: {
      selectedNetworks: SUPPORTED_CHAIN_IDS,
      fallback: {
        [unstable_serialize({
          url: '/pool/api/pools',
          args: {
            selectedNetworks: SUPPORTED_CHAIN_IDS,
            selectedPoolTypes: Object.keys(AVAILABLE_POOL_TYPE_MAP),
            query: '',
            extraQuery: '',
          },
        })]: pools,
      },
      revalidate: 60,
    },
  }
}

const Pools: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback, selectedNetworks }) => {
  const parsedSelectedNetworks = useMemo(() => selectedNetworks.map(Number), [selectedNetworks])
  return (
    <SWRConfig value={{ fallback }}>
      <_Pools selectedNetworks={parsedSelectedNetworks} />
    </SWRConfig>
  )
}

const _Pools = ({ selectedNetworks }: { selectedNetworks: typeof SUPPORTED_CHAIN_IDS }) => {
  return (
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50">Pool</h2>
            <p className="text-slate-300">Earn fees by providing liquidity.</p>
          </div>
          <div className="flex justify-end flex-grow not-prose">
            <div className="flex flex-col gap-3 w-full lg:w-[200px]">
              <Button as="a" href="/pool/add" fullWidth color="blue" startIcon={<PlusIcon width={16} height={16} />}>
                New Position
              </Button>
            </div>
          </div>
        </section>
        <PoolsFiltersProvider selectedNetworks={selectedNetworks}>
          <PoolsSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Pools
