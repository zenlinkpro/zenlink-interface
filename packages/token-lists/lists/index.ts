import type { TokenList } from '../types'
import MOONBEAM_TOKEN_LIST from './moonbeam.json'
import MOONRIVER_TOKEN_LIST from './moonriver.json'
import ASTAR_TOKEN_LIST from './astar.json'
import BIFROST_KUSAMA_TOKEN_LIST from './bifrost-kusama.json'
import DOLPHIN_TOKEN_LIST from './dolphin.json'

export const DEFULT_TOKEN_LIST_MAP: Record<string, TokenList> = {
  'astar': ASTAR_TOKEN_LIST,
  'moonriver': MOONRIVER_TOKEN_LIST,
  'moonbeam': MOONBEAM_TOKEN_LIST,
  'bifrost-kusama': BIFROST_KUSAMA_TOKEN_LIST,
  'dolphin': DOLPHIN_TOKEN_LIST
}

export const ZENLINK_DEFAULT_TOKEN_LIST: TokenList[] = [
  MOONBEAM_TOKEN_LIST,
  MOONRIVER_TOKEN_LIST,
  ASTAR_TOKEN_LIST,
  BIFROST_KUSAMA_TOKEN_LIST,
  DOLPHIN_TOKEN_LIST
]

export const DEFAULT_LIST_OF_LISTS = [
  'astar',
  'moonriver',
  'moonbeam',
  'bifrost-kusama',
  'dolphin'
]

export const DEFAULT_ACTIVE_LIST = [
  'astar',
  'moonriver',
  'moonbeam',
  'bifrost-kusama',
  'dolphin'
]
