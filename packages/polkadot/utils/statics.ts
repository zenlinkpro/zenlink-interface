import type { ApiPromise } from '@polkadot/api'
import { TypeRegistry } from '@polkadot/types/create'

interface Statics {
  api: ApiPromise
  registry: TypeRegistry
}

// NOTE We are assuming that the Api class _will_ set it correctly
export const statics = {
  api: undefined,
  registry: new TypeRegistry(),
} as unknown as Statics
