import { Button } from '@zenlink-interface/ui'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Layout, PoolsFiltersProvider, PoolsSection } from 'components'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { FC } from 'react'
import { useMemo } from 'react'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const selectedNetworks = query && typeof query.networks === 'string'
    ? query.networks.split(',')
    : SUPPORTED_CHAIN_IDS

  return {
    props: {
      selectedNetworks,
    },
  }
}

const Pools: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ selectedNetworks }) => {
  const parsedSelectedNetworks = useMemo(() => selectedNetworks.map(Number), [selectedNetworks])
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
              <Button as="a" href="/earn/add" fullWidth color="blue" startIcon={<PlusIcon width={16} height={16} />}>
                New Position
              </Button>
            </div>
          </div>
        </section>
        <PoolsFiltersProvider selectedNetworks={parsedSelectedNetworks}>
          <PoolsSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Pools
