import { chainShortName } from '@zenlink-interface/chain'
import type { Pair, Pool, StableSwap } from '@zenlink-interface/graph-client'
import { POOL_TYPE, pairById, pairsByChainIds, stableSwapById, stableSwapsByChainIds } from '@zenlink-interface/graph-client'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { AppearOnMount } from '@zenlink-interface/ui'
import { AddSectionStable, AddSectionStandard, Layout, PoolPositionProvider } from 'components'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { swapFeeOfPool } from 'lib/functions'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

const LINKS = ({ pool }: { pool: Pool }): BreadcrumbLink[] => [
  {
    href: `/${pool.id}`,
    label: `${pool.name} - ${AVAILABLE_POOL_TYPE_MAP[pool.type]} - ${swapFeeOfPool(pool.type)}`,
  },
  {
    href: `/${pool.id}/add`,
    label: 'Add Liquidity',
  },
]

const Add: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Add />
    </SWRConfig>
  )
}

const _Add = () => {
  const router = useRouter()
  const { data } = useSWR<{ pool: Pool }>(
    `/pool/api/pool/${router.query.id}`,
    url => fetch(url).then(response => response.json()),
  )

  if (!data)
    return <></>
  const { pool } = data

  return (
    <PoolPositionProvider pool={pool}>
      <Layout breadcrumbs={LINKS(data)}>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            {pool.type === POOL_TYPE.STANDARD_POOL && <AddSectionStandard pair={pool as Pair} />}
            {pool.type === POOL_TYPE.STABLE_POOL && <AddSectionStable pool={pool as StableSwap} />}
          </div>
          <div className="order-1 sm:order-3">
            <AppearOnMount>
              <AddSectionMyPosition pool={pool} />
            </AppearOnMount>
          </div>
        </div>
        <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
      </Layout>
    </PoolPositionProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pools = (
    await Promise.all([
      pairsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
      stableSwapsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
    ])
  ).flat()

  // Get the paths we want to pre-render based on pairs
  const paths = pools
    .sort(({ reserveUSD: a }, { reserveUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 250)
    .map(pool => ({
      params: { id: `${chainShortName[pool.chainId]}:${pool.address}` },
    }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string
  const [pair, stableSwap] = await Promise.all([
    pairById(id),
    stableSwapById(id),
  ])
  const pool = pair || stableSwap

  if (!pool) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch pair, received ${pool}`)
  }

  return {
    props: {
      fallback: {
        [`/pool/api/pool/${id}`]: { pool },
      },
    },
    revalidate: 60,
  }
}

export default Add
