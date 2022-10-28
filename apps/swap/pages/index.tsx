import { useGetStablePools } from '@zenlink-interface/wagmi'

function Swap() {
  const pools = useGetStablePools(2006, {})
  return (
    <div>
      {JSON.stringify(pools)}
    </div>
  )
}

export default Swap
