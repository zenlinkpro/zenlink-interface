import { ParachainId } from '@zenlink-interface/chain'

export const INIT_CODE_HASH: Record<string | number, string> = {
  [ParachainId.MOONRIVER]: '0x4d57d13eb6abe5cc425bd08deb1f15f0562098dddc340a700527b4d98f95f4dd',
  [ParachainId.MOONBEAM]: '0x4d57d13eb6abe5cc425bd08deb1f15f0562098dddc340a700527b4d98f95f4dd',
  [ParachainId.ASTAR]: '0x158e363fa8e6b5b56fdf204db7bdf7eb2d4d84a333c7bd0909090b01c788baed',
}

export const FACTORY_ADDRESS: Record<string | number, string> = {
  [ParachainId.MOONRIVER]: '0x28Eaa01DC747C4e9D37c5ca473E7d167E90F8d38',
  [ParachainId.MOONBEAM]: '0x079710316b06BBB2c0FF4bEFb7D2DaC206c716A0',
  [ParachainId.ASTAR]: '0x7BAe21fB8408D534aDfeFcB46371c3576a1D5717',
}
