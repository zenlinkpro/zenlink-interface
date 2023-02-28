import { chainName, chainShortName } from '@zenlink-interface/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@zenlink-interface/graph-config'
import { fetchDaySnapshots } from '../../queries'
import type { DaySnapshot, DaySnapshotsQueryData } from '../../types'
import { ZenlinkDayInfoOrderByInput } from '../../__generated__/types-and-hooks'

export interface QueryDaySnapshotsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: ZenlinkDayInfoOrderByInput
}

export const daySnapshotsByChainIds = async ({
  chainIds,
  limit = 1000,
  orderBy = ZenlinkDayInfoOrderByInput.DateDesc,
}: QueryDaySnapshotsByChainIdsArgs) => {
  const daySnapshotsTransformer = (snapshotMetas: DaySnapshotsQueryData[], chainId: number) =>
    snapshotMetas.map(snapshotMeta => ({
      ...snapshotMeta,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
    }))

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchDaySnapshots({ chainId, limit, orderBy })
          .then(data =>
            data.data
              ? daySnapshotsTransformer(data.data, chainId)
              : [],
          ),
      ),
  ]).then(daySnapshots =>
    daySnapshots.flat().reduce<DaySnapshot[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
