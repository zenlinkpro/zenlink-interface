import { ParachainId } from '@zenlink-interface/chain'
import axios from 'axios'

import { SUBSCAN_API_KEY, SUBSCAN_ENDPOINTS, ZLK_EVM_ADDRESSES } from './config'

export async function fetchBifrostKusamaZLKHolders() {
  const assetData = await axios.post(
    `${SUBSCAN_ENDPOINTS[ParachainId.BIFROST_KUSAMA]}/api/v2/scan/tokens`,
    {
      provider: 'asset_registry',
      include_extends: true,
      row: 100,
      page: 0,
    },
    { headers: { 'X-API-Key': SUBSCAN_API_KEY } },
  )

  const zlkAssetData = assetData.data.data.tokens.find(
    ({ currency_id }: { currency_id: string }) => currency_id === 'ZLK',
  )

  return zlkAssetData.extends.holders as number | undefined
}

export async function fetchEvmZLKHoldersFromSubScan(chainId: ParachainId) {
  const assetData = await axios.post(
    `${SUBSCAN_ENDPOINTS[chainId]}/api/scan/evm/tokens`,
    { contracts: [ZLK_EVM_ADDRESSES[chainId]] },
    { headers: { 'X-API-Key': SUBSCAN_API_KEY } },
  )

  return assetData.data?.data?.list?.[0].holders as number | undefined
}
