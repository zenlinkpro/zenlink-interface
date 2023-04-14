export const traderjoeV2StateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract ILBFactory',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'tokenX',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'tokenY',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'leftBinLength',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rightBinLength',
        type: 'uint256',
      },
    ],
    name: 'getFullState',
    outputs: [
      {
        components: [
          {
            internalType: 'contract ILBPair',
            name: 'pair',
            type: 'address',
          },
          {
            internalType: 'uint24',
            name: 'activeId',
            type: 'uint24',
          },
          {
            internalType: 'uint16',
            name: 'binStep',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'reserve0',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserve1',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalFee',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint24',
                name: 'id',
                type: 'uint24',
              },
              {
                internalType: 'uint128',
                name: 'reserveX',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'reserveY',
                type: 'uint128',
              },
            ],
            internalType: 'struct JoeV2StateMulticall.BinInfo[]',
            name: 'binInfos',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct JoeV2StateMulticall.StateResult[]',
        name: 'states',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
