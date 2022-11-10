import type { Pair } from '@zenlink-interface/graph-client'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import useSWR from 'swr'

const Pool: FC = () => {
  return (
    <_Pool />
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
  return <>{JSON.stringify(pair)}</>
}

export default Pool
