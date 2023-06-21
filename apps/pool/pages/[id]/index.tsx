import { chainShortName } from '@zenlink-interface/chain'
import type { Pool as GraphPool } from '@zenlink-interface/graph-client'
import { pairById, pairsByChainIds, singleTokenLockById, singleTokenLocksByChainIds, stableSwapById, stableSwapsByChainIds } from '@zenlink-interface/graph-client'
import type { BreadcrumbLink } from '@zenlink-interface/ui'
import { AppearOnMount } from '@zenlink-interface/ui'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { SUPPORTED_CHAIN_IDS } from 'config'
import {
  Layout,
  PoolActionBar,
  PoolButtons,
  // PoolChart,
  // PoolComposition,
  PoolHeader,
  PoolMyRewards,
  PoolPosition,
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  // PoolRewards,
  // PoolStats,
} from 'components'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { swapFeeOfPool } from 'lib/functions'

const LINKS = ({ pool }: { pool: GraphPool }): BreadcrumbLink[] => [
  {
    href: `/${pool.id}`,
    label: `${pool.name} - ${AVAILABLE_POOL_TYPE_MAP[pool.type]} - ${swapFeeOfPool(pool.type)}`,
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
  const { data } = useSWR<{ pool: GraphPool }>(
    `/pool/api/pool/${router.query.id}`,
    url => fetch(url).then(response => response.json()),
  )
  if (!data)
    return <></>

  const { pool } = data

  return (
    <PoolPositionProvider pool={pool}>
      <PoolPositionStakedProvider pool={pool}>
        <PoolPositionRewardsProvider pool={pool}>
          <Layout breadcrumbs={LINKS(data)}>
            <div className="flex flex-col lg:grid gap-12">
              <div className="flex flex-col order-1 gap-9 lg:w-3/5 lg:m-auto">
                <PoolHeader pool={pool} />
                {/* <hr className="my-3 border-t border-slate-500/20 dark:border-slate-200/5" />
                <PoolChart pool={pool} />
                <AppearOnMount>
                  <PoolStats pool={pool} />
                </AppearOnMount>
                <PoolComposition pool={pool} />
                <PoolRewards pool={pool} /> */}

                <AppearOnMount>
                  <div className="flex flex-col gap-10">
                    <PoolMyRewards pool={pool} />
                    <PoolPosition pool={pool} />
                  </div>
                </AppearOnMount>
                <div className="hidden lg:flex">
                  <PoolButtons pool={pool} />
                </div>
              </div>

              {/* <div className="flex flex-col order-2 gap-4">
              </div> */}
            </div>
          </Layout>
          <PoolActionBar pool={pool} />
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pools = (
    await Promise.all([
      pairsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
      stableSwapsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
      singleTokenLocksByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
    ])
  ).flat()

  // Get the paths we want to pre-render based on pairs
  const paths = pools
    .sort(({ reserveUSD: a }, { reserveUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 50)
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
  const [pair, stableSwap, singleTokenLock] = await Promise.all([
    pairById(id),
    stableSwapById(id),
    singleTokenLockById(id),
  ])
  const pool = pair || stableSwap || singleTokenLock

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

export default Pool
