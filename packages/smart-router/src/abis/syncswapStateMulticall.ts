export const syncswapStateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract ISyncswapFactory',
        name: 'classicFactory',
        type: 'address',
      },
      {
        internalType: 'contract ISyncswapFactory',
        name: 'stableFactory',
        type: 'address',
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
    ],
    name: 'getFullState',
    outputs: [
      {
        components: [
          {
            internalType: 'contract ISyncswapPool',
            name: 'pool',
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
            internalType: 'bool',
            name: 'isStable',
            type: 'bool',
          },
          {
            internalType: 'uint24',
            name: 'swapFee',
            type: 'uint24',
          },
        ],
        internalType: 'struct SyncswapStateMulticall.StateResult[]',
        name: 'states',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
