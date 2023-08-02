export const dodoV2StateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract IDODOCommonFactory',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'token1',
        type: 'address',
      },
    ],
    name: 'getFullState',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IDODOCommonPool',
            name: 'pool',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'i',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'K',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'B',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'Q',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'B0',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'Q0',
                type: 'uint256',
              },
              {
                internalType: 'enum IDODOCommonPool.RState',
                name: 'R',
                type: 'uint8',
              },
            ],
            internalType: 'struct IDODOCommonPool.PMMState',
            name: 'state',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'token0',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token1',
            type: 'address',
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
            name: 'lpFeeRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'mtFeeRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'midPrice',
            type: 'uint256',
          },
        ],
        internalType: 'struct DODOV2StateMulticall.StateResult[]',
        name: 'states',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
