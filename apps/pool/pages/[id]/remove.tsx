import { chainShortName } from '@zenlink-interface/chain'
import type { Pair } from '@zenlink-interface/graph-client'
import { pairById, pairsByChainIds } from '@zenlink-interface/graph-client'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { AppearOnMount } from '@zenlink-interface/ui'
import { Layout, PoolPositionProvider, RemoveSectionStandard } from 'components'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { swapFeeOfPool } from 'lib/functions'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

const LINKS = ({ pair }: { pair: Pair }): BreadcrumbLink[] => [
  {
    href: `/${pair.id}`,
    label: `${pair.name} - ${AVAILABLE_POOL_TYPE_MAP[pair.type]} - ${swapFeeOfPool(pair.type)}`,
  },
  {
    href: `/${pair.id}/remove`,
    label: 'Remove Liquidity',
  },
]

const Remove: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Remove />
    </SWRConfig>
  )
}

const _Remove = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: Pair }>(`/pool/api/pool/${router.query.id}`, url =>
    fetch(url).then(response => response.json()),
  )

  if (!data)
    return <></>

  const { pair } = data

  return (
    <PoolPositionProvider pair={pair}>
      <Layout breadcrumbs={LINKS(data)}>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            <RemoveSectionStandard pair={pair} />
          </div>
          <div className="order-1 sm:order-3">
            <AppearOnMount>
              <AddSectionMyPosition pair={pair} />
            </AppearOnMount>
          </div>
        </div>
        <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
      </Layout>
    </PoolPositionProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pairs = await pairsByChainIds({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  // Get the paths we want to pre-render based on pairs
  const paths = pairs
    .sort(({ reserveUSD: a }, { reserveUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 250)
    .map(pair => ({
      params: { id: `${chainShortName[pair.chainId]}:${pair.address}` },
    }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string
  const pair = await pairById(id)

  if (!pair) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch pair, received ${pair}`)
  }

  return {
    props: {
      fallback: {
        [`/pool/api/pool/${id}`]: { pair },
      },
    },
    revalidate: 60,
  }
}

export default Remove
