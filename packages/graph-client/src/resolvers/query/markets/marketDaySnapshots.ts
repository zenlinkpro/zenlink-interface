import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import { FactoryDayDataOrderByInput } from '../../../__generated__/market-types'
import type { MarketDaySnapshot, MarketDaySnapshotsQueryData } from '../../../types'
import { fetchMarketDaySnapshots } from '../../../queries'

interface QueryDaySnapshotsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: FactoryDayDataOrderByInput
}

export async function marketDaySnapshotsByChainIds({
  chainIds,
  limit = 1000,
  orderBy = FactoryDayDataOrderByInput.DateDesc,
}: QueryDaySnapshotsByChainIdsArgs) {
  const daySnapshotsTransformer = (snapshotMetas: MarketDaySnapshotsQueryData[], chainId: number) => snapshotMetas.map(snapshotMeta => ({
    ...snapshotMeta,
    chainId,
    chainName: chainName[chainId],
    chainShortName: chainShortName[chainId],
  }))

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchMarketDaySnapshots({ chainId, limit, orderBy })
          .then(data =>
            data.data
              ? daySnapshotsTransformer(data.data, chainId)
              : [],
          ),
      ),
  ]).then(daySnapshots =>
    daySnapshots.flat().reduce<MarketDaySnapshot[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
