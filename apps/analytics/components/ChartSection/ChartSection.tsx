import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { usePoolFilters } from 'components'
import stringify from 'fast-json-stable-stringify'
import { useMemo } from 'react'
import useSWR from 'swr'
import { TVLChart } from './TVLChart'
import { VolumeChart } from './VolumeChart'

async function fetcher({
  url,
  args,
}: {
  url: string
  args: {
    selectedNetworks: ParachainId[]
  }
}) {
  const _url = new URL(url, window.location.origin)
  if (args.selectedNetworks)
    _url.searchParams.set('networks', stringify(args.selectedNetworks))

  return fetch(_url.href)
    .then(res => res.json())
    .catch()
}

export const ChartSection: FC = () => {
  const { selectedNetworks } = usePoolFilters()
  const args = useMemo(() => ({ selectedNetworks }), [selectedNetworks])
  const { data } = useSWR({ url: '/analytics/api/charts', args }, fetcher)

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="p-6 bg-slate-300/20 dark:bg-slate-800/20 rounded-xl">
        <TVLChart x={data?.[0]?.[0] || []} y0={data?.[0]?.[1] || []} y1={data?.[0]?.[2] || []} />
      </div>
      <div className="p-6 bg-slate-300/20 dark:bg-slate-800/20 rounded-xl">
        <VolumeChart x={data?.[1]?.[0] || []} y0={data?.[1]?.[1] || []} y1={data?.[1]?.[2] || []} />
      </div>
    </section>
  )
}
