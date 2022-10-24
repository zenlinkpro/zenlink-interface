import type { TokenList } from '@zenlink-interface/token-lists'

import MOONBEAM_TOKEN_LIST from './moonbeam.json'
import MOONRIVER_TOKEN_LIST from './moonriver.json'
import ASTAR_TOKEN_LIST from './moonbeam.json'

export const DEFULT_TOKEN_LIST_MAP = {
  astar: ASTAR_TOKEN_LIST,
  moonriver: MOONRIVER_TOKEN_LIST,
  moonbeam: MOONBEAM_TOKEN_LIST,
}

export const ZENLINK_DEFAULT_TOKEN_LIST: TokenList[] = [
  MOONBEAM_TOKEN_LIST,
  MOONRIVER_TOKEN_LIST,
  ASTAR_TOKEN_LIST,
]

export const DEFAULT_LIST_OF_LISTS = [
  'astar',
  'moonriver',
  'moonbeam',
]

export const DEFAULT_ACTIVE_LIST = [
  'astar',
  'moonriver',
  'moonbeam',
]
