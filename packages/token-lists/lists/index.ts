import type { TokenList } from '../types'
import MOONBEAM_TOKEN_LIST from './moonbeam.json'
import MOONRIVER_TOKEN_LIST from './moonriver.json'
import ASTAR_TOKEN_LIST from './astar.json'
import BIFROST_KUSAMA_TOKEN_LIST from './bifrost-kusama.json'
import BIFROST_POLKADOT_TOKEN_LIST from './bifrost-polkadot.json'
import ARBITRUM_ONE_TOKEN_LIST from './arbitrum-one.json'
import MANTA_POLKADOT_TOKEN_LIST from './manta-polkadot.json'
import MANTA_STAGING_TOKEN_LIST from './manta-staging.json'
import CALAMARI_KUSAMA_TOKEN_LIST from './calamari-kusama.json'

export const DEFULT_TOKEN_LIST_MAP: Record<string, TokenList> = {
  'astar': ASTAR_TOKEN_LIST,
  'moonriver': MOONRIVER_TOKEN_LIST,
  'moonbeam': MOONBEAM_TOKEN_LIST,
  'bifrost-kusama': BIFROST_KUSAMA_TOKEN_LIST,
  'bifrost-polkadot': BIFROST_POLKADOT_TOKEN_LIST,
  'arbitrum-one': ARBITRUM_ONE_TOKEN_LIST,
  'calamari-kusama': CALAMARI_KUSAMA_TOKEN_LIST,
  'manta-staging': MANTA_STAGING_TOKEN_LIST,
  'manta-polkadot': MANTA_POLKADOT_TOKEN_LIST,
}

export const ZENLINK_DEFAULT_TOKEN_LIST: TokenList[] = [
  MOONBEAM_TOKEN_LIST,
  MOONRIVER_TOKEN_LIST,
  ASTAR_TOKEN_LIST,
  BIFROST_KUSAMA_TOKEN_LIST,
  BIFROST_POLKADOT_TOKEN_LIST,
  ARBITRUM_ONE_TOKEN_LIST,
  CALAMARI_KUSAMA_TOKEN_LIST,
  MANTA_STAGING_TOKEN_LIST,
  MANTA_POLKADOT_TOKEN_LIST,
]

export const DEFAULT_LIST_OF_LISTS = [
  'astar',
  'moonriver',
  'moonbeam',
  'bifrost-kusama',
  'bifrost-polkadot',
  'arbitrum-one',
  'calamari-kusama',
  'manta-staging',
  'manta-polkadot',
]

export const DEFAULT_ACTIVE_LIST = [
  'astar',
  'moonriver',
  'moonbeam',
  'bifrost-kusama',
  'bifrost-polkadot',
  'arbitrum-one',
  'calamari-kusama',
  'manta-staging',
  'manta-polkadot',
]
