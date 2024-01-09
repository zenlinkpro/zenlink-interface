import { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'

export const ReferralStorageContractAddresses: Record<number, Address> = {
  [ParachainId.ASTAR]: '0xf6EA707CBf38f2Acf3bf029429B55192c61c67ad',
  [ParachainId.ARBITRUM_ONE]: '0xb0Fa056fFFb74c0FB215F86D691c94Ed45b686Aa',
  [ParachainId.MOONBEAM]: '0x2ec9396fB28719dAcF460b1501ef7Fb412Aed501',
  [ParachainId.SCROLL_ALPHA]: '0x2351D28141e0c005907640F6B48d70758bFa4e97',
  [ParachainId.SCROLL]: '0x7BAe21fB8408D534aDfeFcB46371c3576a1D5717',
  [ParachainId.BASE]: '0xf5016C2DF297457a1f9b036990cc704306264B40',
}
