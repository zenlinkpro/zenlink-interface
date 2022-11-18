import { chainShortName } from '@zenlink-interface/chain'
import type { Pair } from '@zenlink-interface/graph-client'
import { pairById, pairsByChainIds } from '@zenlink-interface/graph-client'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { AppearOnMount } from '@zenlink-interface/ui'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'
import {
  Layout,
  PoolActionBar,
  PoolButtons,
  PoolChart,
  PoolComposition,
  PoolHeader,
  PoolPosition,
  PoolPositionProvider,
  PoolStats,
} from 'components'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { swapFeeOfPool } from 'lib/functions'

const LINKS = ({ pair }: { pair: Pair }): BreadcrumbLink[] => [
  {
    href: `/${pair.id}`,
    label: `${pair.name} - ${AVAILABLE_POOL_TYPE_MAP[pair.type]} - ${swapFeeOfPool(pair.type)}`,
  },
]

const Pool: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pool />
    </SWRConfig>
  )
}

const _Pool = () => {
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
        <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
          <div className="flex flex-col order-1 gap-9">
            <PoolHeader pair={pair} />
            <hr className="my-3 border-t border-slate-200/5" />
            <PoolChart pair={pair} />
            <AppearOnMount>
              <PoolStats pair={pair} />
            </AppearOnMount>
            <PoolComposition pair={pair} />
          </div>

          <div className="flex flex-col order-2 gap-4">
            <AppearOnMount>
              <div className="flex flex-col gap-10">
                <PoolPosition pair={pair} />
              </div>
            </AppearOnMount>
            <div className="hidden lg:flex">
              <PoolButtons pair={pair} />
            </div>
          </div>
        </div>
      </Layout>
      <PoolActionBar pair={pair} />
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

export default Pool
