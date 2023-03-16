import axios from 'axios'
import { ParachainId } from '@zenlink-interface/chain'
import { SUBSCAN_API_KEY, SUBSCAN_ENDPOINT, ZLK_EVM_ADDRESS } from './config'
export async function fetchBifrostKusamaZLKHolders() {
  const endpoint = SUBSCAN_ENDPOINT[ParachainId.BIFROST_KUSAMA]

  const assetData = await axios.post(`${endpoint}/api/v2/scan/tokens`, {
    provider: 'asset_registry',
    include_extends: true,
    row: 100,
    page: 0,
  }, {
    headers: {
      'X-API-Key': SUBSCAN_API_KEY,
    },
  })

  const zlkAssetData = assetData.data.data.tokens.find((item: any) => {
    return item.currency_id === 'ZLK'
  })

  const holders = zlkAssetData.extends.holders
  return holders
}

export async function fetchEvmZLKHoldersBySubScan(chainId: ParachainId) {
  const endpoint = SUBSCAN_ENDPOINT[chainId]
  const zlkAddress = ZLK_EVM_ADDRESS[chainId]
  const assetData = await axios.post(`${endpoint}/api/scan/evm/tokens`, {
    contracts: [zlkAddress],
  }, {
    headers: {
      'X-API-Key': SUBSCAN_API_KEY,
    },
  })

  const zlkAssetData = assetData.data?.data?.list?.[0]

  const holders = zlkAssetData.holders
  return holders
}
