import { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'

export const veContract: Record<number, Address> = {
  [ParachainId.MOONBEAM]: '0x7310468a0607003AB7DBc23af44c88565E945a3e',
}

export const votingControllerContract: Record<number, Address> = {
  [ParachainId.MOONBEAM]: '0x3fbAf4FBf6A2198c1E347e9e6f5bd842c3d70488',
}
