import { TypeRegistry } from '@polkadot/types'

// applies Substrate types and endpoint augmentation
import '@polkadot/types-augment'
import '@polkadot/api-augment'
import '@polkadot/rpc-augment'

const registry = new TypeRegistry()

export default registry
